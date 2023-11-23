const getPartnarInfo = (participants, email) => {
  return participants?.find((participant) => participant?.email !== email);
};

export default getPartnarInfo;
