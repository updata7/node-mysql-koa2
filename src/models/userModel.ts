/*
 * @Author: CKJiang 
 * @Date: 2022-08-23 19:00:28 
 * @Last Modified by: CkJiang
 * @Last Modified time: 2022-08-24 00:32:11
 */

import { DataTypes, Sequelize, Model } from 'sequelize'
import { BaseModelStatic, BaseModel } from './base';

export interface User extends BaseModel, Model {
    id: typeof DataTypes.INTEGER;
    name: typeof DataTypes.STRING;
    address: typeof DataTypes.STRING;
    description: typeof DataTypes.STRING;
}

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default(sequelize: Sequelize) => {
	const UserModel = sequelize.define('user', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			validate: {
				// We require usernames to have length of at least 3, and
				// only use letters, numbers and underscores.
				is: /^\w{3,}$/
			},
            comment: "user name, 用户名"
		},
        address: {
			allowNull: false,
			type: DataTypes.STRING,
            comment: "user address"
		},
        description: {
            allowNull: false,
            type: DataTypes.STRING,
            comment: "user description"
        }
	}, {
        // open timestamps
        timestamps: true,
        // dont use updatedAt
        updatedAt: false,
    }) as BaseModelStatic<User>;
    return UserModel;
};
