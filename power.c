#include <stdlib.h>
#include <stdio.h>

int
main(int argc, char* argv[])
{
    double power;
    double coefficient = 1;

    if (argc < 2) {
        fprintf(stderr, "%s [power] (coefficient)\n", argv[0]);
        return 1;
    }
    power = strtod(argv[1], NULL);
    if (argc > 2)
        coefficient = strtod(argv[2], NULL);

    printf("f(x)  = %g*pow(x, %g)\n",
        coefficient, power
    );
    printf("f'(x) = %g*pow(x, %g)\n",
        coefficient * power, power - 1
    );
    printf("F(x)  = %g/%g * pow(x, %g)\n",
        coefficient, (power + 1), power + 1
    );
    return 0;
}
