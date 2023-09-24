module.exports = (sequelize, DataTypes) => {
    const TodoList = sequelize.define("TodoList", {
        todo: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return TodoList;
};