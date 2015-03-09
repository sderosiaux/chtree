# What is it ?
Walks through a directory and prints out a treeview of its content.

It doesn't use walk-fs or other walking modules because in order to have a 'clean' code I needed callbacks those libs did not provide (exit a folder).

# How to
    $ npm install

    $ node index.js
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
    
          - system
            · supports-colors.js
    
          · colors.js
          · extendStringPrototype.js
          · index.js
          · styles.js

# Help
`node index.js --help`

# Todo
- Be able to install it with `npm -g`.
- Publish it to npm.
- Add tests.
