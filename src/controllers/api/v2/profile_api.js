const profile = (request, response) => {
  return response.json(200, {
    profile: [],
    message: "profile fetched",
  });
};
module.exports = { profile };
