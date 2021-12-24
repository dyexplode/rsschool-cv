# Curriculum Vitae
# Vladimir Kahanovski
===================================


## Contact information
>E-mail: *admin@ttp.by*

>Tel.: *+375-29-**535-15-27***


## About me
Programming is a hobby. I am a chemical engineer.

I want to learn how to develop high-quality web applications.

## Skills
* Programming languages
    + Delphi
    + C
    + SQL
    + Python
    + Visual Basic for Application (VBA)
    + HTML
* Operation systems
    + Windows
    + FreeBSD
* Development tools
    + CodeVision AVR
    + Delphi 7
    + Visual Studio Code
    

## Sample code
```
def shell_sort(data: list[int]) -> list[int]:
    last_index = len(data) - 1
    step = len(data)//2
    while step > 0:
        for i in range(step, last_index + 1, 1):
            j = i
            delta = j - step
            while delta >= 0 and data[delta] > data[j]:
                data[delta], data[j] = data[j], data[delta]
                j = delta
                delta = j - step
        step //= 2
    return data
```


## Work experiance
As an example, a website written in delphi 7.
[Flomaster.by](http://flomaster.by "Simple site")


## Education and training
In 2012 graduated from the Belarusian State Technological University with a degree in chemical engineering.

## Languages
- Belorussian
- Russian
- English **Pre-Intermediate** (А2)