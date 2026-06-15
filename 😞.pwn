#include <a_samp>

new x = 1000;
new timer_id;

forward watafuck();
public watafuck()
{
    if (x <= 0)
    {
        print("let me die");
        KillTimer(timer_id);
        return 1;
    }

    printf("%i-7=%i", x, x-7);
    x -= 7;
    return 1;
}

main()
{
    timer_id = SetTimer("watafuck", 300, true);
}
