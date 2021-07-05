# data-analyser

This data analyser uses dataframe-js to read and analyse a specific format of csv files and show the results and status of the data based on the quality of the data and mode of calculations.

This is my FIRST EVER ATTEMPT at using javascript so the code is super messy and is going to be a nightmare to debug or add features to (but at least it works).

# Libraries used
- dataframe-js by Gmousse https://github.com/Gmousse/dataframe-js
- bignumber-js by Evalir https://github.com/MikeMcl/bignumber.js/
- papaparse by pschlatt https://github.com/mholt/PapaParse

dataframe-js is kind of like a replica of pandas from python whereas bignumber-js was used for precise calculations and to avoid rounding errors. Papaparse was also used to convert csv files into string object which is then processed by dataframe-js.

NOTE: currently in the works of creating a more organized server-based replica with nodejs and python.
