import fs from 'fs';
import path from 'path';
import util from 'util';
import rimraf from 'rimraf';
import fetch from 'node-fetch';

export enum URLConstants {
  Patterns1 = 'https://api.unsplash.com/collections/857397/photos',
  Patterns2 = 'https://api.unsplash.com/photos/random',
}

export interface detail {
  name: string;
  path: string;
  url: string;
}

type CollectionMap = Map<string, detail>;

export default class Loader {
  collections: CollectionMap = new Map();
  collectionFolder = '../data/collections';

  constructor() {
    this.ensureExists(this.collectionFolder);
  }

  async setupCollection(name: string, url: string) {
    if (this.collections.get(name)) return;

    var newDetail = {
      name,
      url,
      path: `${this.collectionFolder}${encodeURI(name)}`,
    };

    this.collections.set(name, newDetail);
  }

  async checkExists(pathString: string): Promise<Boolean> {
    const relPath = path.resolve(__dirname, pathString);
    const access = (path) =>
      new Promise<boolean>((resolve, reject) => {
        fs.access(path, (err) => {
          if (err && err.code === 'ENOENT') {
            resolve(false);
          }
          if (!err) {
            resolve(true);
          }
          reject();
        });
      });

    const res = await access(relPath);
    return res;
  }

  async safeRemove(pathString: string) {
    const relPath = path.resolve(__dirname, pathString);

    if (!(await this.checkExists(relPath))) return;
    const rmrf = (path) =>
      new Promise((resolve, reject) => {
        rimraf(path, (err) => {
          if (err) reject();
          resolve();
        });
      });

    await rmrf(relPath);
  }

  async ensureExists(pathString: string) {
    const relPath = path.resolve(__dirname, pathString);
    if (await this.checkExists(relPath)) return;
    const mkdir = (path) =>
      new Promise((resolve, reject) => {
        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) {
            console.log(err);
            reject();
          }
          resolve();
        });
      });

    await mkdir(relPath);
    const res = await this.checkExists(pathString);
  }

  async loadCollection(name: string) {
    const details = this.getDetails(name);
    if (!details) return;

    if (await this.checkExists(details.path)) return;

    const res = await fetch(details.url);
    console.log(res);
  }

  getDetails(name: string) {
    return this.collections.get(name);
  }
}
