module MyCounterAddr::MyCounter{

    use std::signer;
    use std::debug;


    struct Counter has store,key{
        value:u64
    }

    public fun init(account : &signer){
        move_to(account,Counter{value:0});
    }

    public fun increment(account : &signer) acquires Counter{
        let counter = borrow_global_mut<Counter>(signer::address_of(account));
        counter.value = counter.value + 1;
    }

    public fun incrementbyValue(account : &signer, increasement:u64) acquires Counter{
        let counter = borrow_global_mut<Counter>(signer::address_of(account));
        counter.value = counter.value + increasement;
    }

    public entry fun init_counter(account : signer){
        Self::init(&account)
    }

    public entry fun incre_counter(account : signer) acquires Counter{
        Self::increment(&account)
    }

    public entry fun incre_value(account : signer) acquires Counter{
        Self::incrementbyValue(&account, 38)
    }
}

