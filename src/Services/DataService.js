// @flow

const swap32 = val => {
  return (
    ((val & 0xff) << 24) |
    ((val & 0xff00) << 8) |
    ((val >> 8) & 0xff00) |
    ((val >> 24) & 0xff)
  );
};

const swap8 = val => {
  return ((val & 0xf) << 4) | ((val & 0xf0) >> 4);
};

export default class DataService {
  path: string;
  numImages: ?number;
  numRows: ?number;
  numColumns: ?number;
  infoLength: number;
  bigEndian: boolean;
  byteArray: any;

  constructor(path: string) {
    this.path = path;
    this.numImages = null;
    this.numRows = null;
    this.numColumns = null;
    this.infoLength = 16;
    this.byteArray;
    this.bigEndian = false;
  }

  init = (magicNumber: number): Promise<number> => {
    const request = new XMLHttpRequest();
    request.open("GET", this.path, true);
    request.responseType = "arraybuffer";

    const promise = new Promise((resolve, reject) => {
      request.onload = oEvent => {
        const buffer = request.response;
        const byteArray = new Int32Array(buffer, 0, 4);
        if (byteArray[0] == magicNumber) {
          this.bigEndian = true;
        } else if (swap32(byteArray[0]) != magicNumber) {
          throw Error(
            `${
              byteArray[0]
            } not equal to magic number: ${magicNumber} (byte flip: ${swap32(
              byteArray[0]
            )})`
          );
        }
        this.numRows = this._get32(byteArray[2]);
        this.numColumns = this._get32(byteArray[3]);
        this.numImages = this._get32(byteArray[1]);

        this.byteArray = new Uint8Array(buffer, this.infoLength);
        resolve(this.numImages);
      };
    });
    request.send();
    return promise;
  };

  getImage = (index: number): Promise<?Array<Array<number>>> => {
    if (
      !this.numImages ||
      !this.numColumns ||
      !this.numRows ||
      index > this.numImages - 1
    ) {
      return Promise.resolve(null);
    }

    // avoid type refinement invalidation
    const [numImages, numColumns, numRows] = [
      this.numImages,
      this.numColumns,
      this.numRows
    ];

    const offset = index * this.numColumns * this.numRows;

    return new Promise((resolve, reject) => {
      const matrix: Array<Array<number>> = [];
      for (let y = 0; y < numRows; y++) {
        matrix.push([]);
      }
      for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numColumns; x++) {
          matrix[y].push(this.byteArray[offset + y * numColumns + x]);
        }
      }

      resolve(matrix);
    });
  };

  _get32 = (val: number) => (this.bigEndian ? val : swap32(val));

  _get8 = (val: number) => (this.bigEndian ? val : swap8(val));
}
