# What is it ?
Walks through a directory and prints out a treeview of its content with colors.

It doesn't use walk-fs or other walking modules because in order to have a 'clean' code I needed callbacks those libs did not provide (exit a folder).

# How to
    $ npm install -g chtree

    $ chtree
    - node_modules
      - colors
        - examples
          · normal-usage.js
          · safe-string.js
    
        - lib
          - custom
            · trap.js
            · zalgo.js
    
          - maps
            · america.js
            · rainbow.js
            · random.js
            · zebra.js
          ...

    # ignore everything that does not begin with a digit
    $ chtree --ignore ^[^0-9]
    - .git
      - objects
        - 01

        - 02
          · 1600ab51609a802dc15d5180ccbf6fd701b8fe

        - 03
          · 3e16f7e94dd80c183295b4cd283e92398936b3

        - 04
          · 33d2cfbef7ed75a87341dd1dc11f437649134d
        ...


# Help
    $ chtree --help
    chtree [directory] [--no-colors] [--ignore regexp]

# Todo
- Add tests.
