const currentDate = () => {
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();
    let date = day + "-" + month + "-" + year;
    return date
}

const assignKeyValueToObject = (obj, key, value) => {
    obj[key] = value;
    return obj;
}

const findObjectById = (arrayOfObects, id) => {
    for (let i = 0; i < arrayOfObects.length; i++) {
      if (arrayOfObects[i]._id == id) return arrayOfObects[i];
    }
    return null;
}


module.exports = {
    currentDate,
    assignKeyValueToObject,
    findObjectById
}