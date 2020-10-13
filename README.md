# data-analyser

This data analyser uses dataframe-js to read and analyse a specific format of csv files and show the results and status of the data based on the quality of the data and mode of calculations.

This is my first ever attempt at using javascript so the code is bad and alot of it is very redundant.

# Libraries used
- dataframe-js by Gmousse https://github.com/Gmousse/dataframe-js
- bignumber-js by Evalir https://github.com/MikeMcl/bignumber.js/
- papaparse by pschlatt https://github.com/mholt/PapaParse

dataframe-js is kind of like a replica of pandas from python whereas bignumber-js was used for precise calculations and to avoid rounding errors. Papaparse was also used to convert csv files into string object which is then processed by dataframe-js.
