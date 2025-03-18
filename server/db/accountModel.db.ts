import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { sequelize } from './conn';

export class AccountModel extends Model<InferAttributes<AccountModel>, InferCreationAttributes<AccountModel>>{
    declare username: string;
    declare password: string;
    
    
}
AccountModel.init(
    {
        username:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        password:{
            type: DataTypes.STRING,
            allowNull:false
        },
      
    },
        {
            sequelize,
        

}
);
