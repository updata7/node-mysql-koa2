/*
 * @Author: CKJiang 
 * @Date: 2022-08-23 16:25:05 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-23 16:25:30
 */


class RouterPath {
    directories: Array<string>;
    excludePaths: Array<string>;
    constructor(directories: Array<string>, excludePaths: Array<string>){
        this.directories = directories;
        this.excludePaths = excludePaths;
    }
}

export { RouterPath }