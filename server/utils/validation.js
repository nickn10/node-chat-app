const isRealString = (str) => {
	return typeof str === "string" && str.trim().length > 0;
}

function uniqueUserName(name, roomUsers) {
  let prevUser = roomUsers.filter((user) => user.name.toLowerCase() === name.toLowerCase())
  return prevUser
}

module.exports = {isRealString, uniqueUserName}