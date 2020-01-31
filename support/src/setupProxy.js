/// <reference path="../../node_modules/@types/express/index.d.ts"/>

const fs          = require('fs');
const path        = require('path');
const util        = require('util');

/**
 * Async wrapper for readFile
 */
const readFileAsync = util.promisify(fs.readFile);

/**
 * Async wrapper for readDir
 */
const readDirAsync = util.promisify(fs.readdir);

/**
 * Middleware for getting a Term object by ID or Pretty Url Name field.
 * @param {Express.Request} req
 * @param {Express.Response} res 
 * @param {Function} next 
 */
const getTermByIdOrPrettyUrl = async (req, res, next) => {
  const { dictionary, audience, language, id_or_purl } = req.params;

  const searchDir = path.join(__dirname, '..', 'mock-data', 'Terms', dictionary, audience, language);

  try {
    const mocks = (await readDirAsync(searchDir))
      .reduce((filemap, mockfile) => {
        const [ term_id, purl ] = mockfile
          .replace(".json", "")
          .split("__");
        filemap[term_id] = path.join(searchDir, mockfile);
        if (purl && purl !== 'null') {
          // Some terms may not have a prettyurl name
          // I probably would name the file 12344__null.json
          filemap[purl] = path.join(searchDir, mockfile);
        }
        return filemap;
      }, {});

    if (mocks[id_or_purl]) {
      res.sendFile(mocks[id_or_purl]);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.error(err);
    res.status(404).end();
  }
};

/**
 * Middleware setup for "setupProxy"
 * @param {Express.Application} app 
 */
const middleware = (app) => {

  app.use(
    '/api/Terms/:dictionary/:audience/:language/:id_or_purl',
    getTermByIdOrPrettyUrl
  );

  app.use(
    '/api/*',
    (req, res, next) => {
      console.error("Api path not implemented");
      res.status(404).end();
    }
  )

}

module.exports = middleware;
