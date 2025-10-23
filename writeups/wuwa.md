
Wuthering Waves is Kuro Games' entry into the open-world gacha genre, released on May 23 of this year. The game comes bundled with ==Anticheat Expert== (ACE for short), a kernel anticheat developed by Tencent. Though much weaker than its competitors in the space, it still poses serious challenges to any prospective developers. A rudimentary, strictly usermode approach is not enough. Let's explore one way to surmount its defenses!  
  
  
## Anticheat Expert

Like nearly every other anticheat solution, ACE checks the process list for programs it deems to be "hacking tools". Convenient programs like Cheat Engine and Process Hacker are blacklisted, and the game will close if they are detected. As is standard when working against kernel anticheats, it is best to build a custom, renamed version of Cheat Engine.  This will easily bypass the process title check. 

Now, if we attach our undetected Cheat Engine to the game:

![image](https://hackmd.io/_uploads/SywEnWBUA.png)



We are met with a wall of nothing. The memory cannot be read. This is because of ACE's ==ObCallbacks==. 

You can think of ObCallbacks as a tripwire system; whenever something tries to open a handle to the game process, their callback functions trigger first. From there, the function can decide how to deal with the handle request. In the case of ACE, their callbacks strip our handle of its desired access rights. Every usermode debugger or memory viewer relies on these handles to get access to process memory, so we must bypass this protection to proceed.

## Iterating ObCallbacks

Fortunately for us, ObCallbacks are stored in a doubly linked list that can be found in memory. A KMDF Kernel Driver is perfect for the search, as it will have easy access to this memory. All of the coming code snippets should be understood as code that will run from our kernel driver, which we will load with a public CVE.

We can start by finding the head of the list. By locally debugging with WinDbg and entering
==*(nt!_OBJECT_TYPE **)&nt!PsProcessType==, we get:

![image](https://hackmd.io/_uploads/B1ghdfrLC.png)

At offset ==0xC8== is our ==CallbackList==. This is the head of the list entries. We simply dereference the ==POBJECT_CALLBACK_ENTRY== structure at the address of ==PsProcessType + 0xC8== to retrieve these programmatically.

``` c=
POBJECT_TYPE pObject; // either PsProcessType or PsThreadType

POBJECT_CALLBACK_ENTRY pCallbackEntry = 
    *(POBJECT_CALLBACK_ENTRY*)((UCHAR*)pObject + 0xC8); 
```







The individual object callback entries starting at this address are defined in the ==OBJECT_CALLBACK_ENTRY== struct:

``` c=
typedef struct _OBJECT_CALLBACK_ENTRY
{
	LIST_ENTRY CallbackList;
	OB_OPERATION Operations;
	ULONG Active;
	PCALLBACK_ENTRY CallbackEntry;
	POBJECT_TYPE ObjectType;
	POB_PRE_OPERATION_CALLBACK  PreOperation;
	POB_POST_OPERATION_CALLBACK PostOperation;
} OBJECT_CALLBACK_ENTRY, * POBJECT_CALLBACK_ENTRY;
```

The ==LIST_ENTRY== struct ==CallbackList== is their first element. This means we can traverse from entry to entry using ==CallbackList->Flink== (forward link) and ==CallbackList->Blink== (backward link). This makes iterating callback entries fairly simple. We begin at the list head, and check if that callback belongs to ACE. If it does, we patch it appropriately. Otherwise, we progress to the next entry with a ==Flink== and check again. 

To know which module registered the current callback entry, we can enumerate all system modules. For each one, we must check whether the PreOperation callback address falls in the bounds of its address space. If it does, then the callback belongs to that module. 

``` c=
PCHAR getNameFromAddr(UINT_PTR addr)
{
	PVOID moduleList = getModuleList();
	PRTL_PROCESS_MODULES modules = (PRTL_PROCESS_MODULES)moduleList;

	for (SIZE_T i = 0; i < modules->NumberOfModules; i++)
	{
		PRTL_PROCESS_MODULE_INFORMATION modInfo = &modules->Modules[i];
		if (addr <= (UINT_PTR)modInfo->ImageBase + (UINT_PTR)modInfo->ImageSize && addr >= (UINT_PTR)modInfo->ImageBase)
			return (PCHAR)(modInfo->FullPathName + modInfo->OffsetToFileName);
	}

	return "unknown module";
}

PVOID getModuleList()
{
	ULONG len = 0;

	ZwQuerySystemInformation(SystemModuleInformation, NULL, 0, &len);
	len += (1024 * 0xA);

	PVOID moduleList = ExAllocatePoolWithTag(PagedPool, len, 0);

	if (!NT_SUCCESS(ZwQuerySystemInformation(SystemModuleInformation, moduleList, len, &len)))
	{
		if (moduleList)
			ExFreePool(moduleList);

		return NULL;
	}

	return moduleList;
}
```

Using the above functions, we discern which module registered the current callback. If that module's ==name== happens to be ==ACE-BASE.sys==, then we have found the anticheat's callback function!

``` c=
PCALLBACK_ENTRY preOp = (PCALLBACK_ENTRY)pCallbackEntry->PreOperation;

PCHAR name = getNameFromAddr((UINT_PTR)preOp);

if (strcmp(name, "ACE-BASE.sys") {
        // handle callback
}
```




## Hooking with a dummy callback

The most intuitive way of overcoming these ObCallbacks is by switching the address of their PreOperation function to the address of a dummy callback function in our driver. In essence, we are hooking their PreOperation. 

We begin by saving the original PreCallback address into ==originalCallback==, and overwriting it with the address of our ==dummyCallback== function:

``` c=
originalCallback = pCallbackEntry->PreOperation;
pCallbackEntry->PreOperation = (POB_PRE_OPERATION_CALLBACK)&dummyCallback;
msg("patched dummy callback");
```

Where our ==dummyCallback== function is as follows:

``` c=
OB_PREOP_CALLBACK_STATUS dummyCallback(PVOID RegistrationContext, POB_PRE_OPERATION_INFORMATION OperationInformation)
{
    auto result = originalCallback(RegistrationContext, OperationInformation);
    OperationInformation->Parameters->CreateHandleInformation.DesiredAccess = 
    OperationInformation->Parameters->CreateHandleInformation.OriginalDesiredAccess;
    return result;
}
```

Now whenever their callbacks are triggered, the PreOperation will run our dummyCallback function. To ensure safe execution, we run their original PreOperation function first. Then, we change our handle's access back to its ==OriginalDesiredAccess== before returning. 

Now when we load our driver code while the game is running and open the process with our custom Cheat Engine, we get this:

![image](https://hackmd.io/_uploads/SJqfhO54R.png)


Victory at last! Memory can be viewed, and the game can be freely debugged. 

## Conclusion
Beyond its ObCallbacks, Anticheat Expert does a very poor job at fending off attackers. Regardless, this exercise was an educational success in bypassing the anticheat of a new game. Its always less about cheating in a video game than it is attaining better understanding of the kernel. ObCallbacks are employed by more serious anticheats (ex. BattlEye). I hope to use this experience as a springboard to bypass them too. I will certainly write again if I do!

- Riley

















