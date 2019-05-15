mkdir -p bin

FLAGS_ANSI="\
    -Wall -pedantic -std=c89 -s \
    -Wall -Wshadow -Wredundant-decls -Wextra -Wcast-align -Wcast-qual \
    -Wdisabled-optimization -Wformat=2 -Winit-self -Wlogical-op
    -Wmissing-include-dirs -Wstrict-overflow=1 -Wundef -Wno-unused \
    -Wno-variadic-macros -Wno-parentheses -fdiagnostics-show-option"

gcc $FLAGS_ANSI -o bin/power power.c
