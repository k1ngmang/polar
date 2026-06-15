new memory[30000];
new ptr = 0;

forward execute(data[]);
public execute(data[])
{
    new currentChar;
    new loop;
    new output[1024];

    for (new i = 0; data[i] != 0; ++i)
    {
        currentChar = data[i];
        switch(currentChar)
        {
            case '>': { ++ptr; }
            case '<': { --ptr; }
            case '+': { ++memory[ptr]; }
            case '-': { --memory[ptr]; }
            case '.': { format(output, sizeof(output), "%s%c", output, memory[ptr]); }
            case ',':
            {
                printf("Input is not implemented");
                return 1;
            }
            case '[':
            {
                if(memory[ptr] == 0)
                {
                    loop = 1;
                    while(loop > 0)
                    {
                        currentChar = data[++i];
                        if (currentChar == '[') loop++;
                        else if (currentChar == ']') loop--;
                    }
                }
            }
            case ']':
            {
                if(memory[ptr] != 0)
                {
                    loop = 1;
                    while(loop > 0)
                    {
                        currentChar = data[--i];
                        if(currentChar == '[') loop--;
                        else if (currentChar == ']') loop++;
                    }
                }
            }
        }
    }
    
    if(output[0] != '\0') printf(output);
    return 0;
}

main()
{
    new program[] = "++>++<[->+<]>.";
    execute(program);
    return 0;
}
