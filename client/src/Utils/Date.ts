import globalStore from "../Stores/GlobalStore";

const getNewDate = (): string => {
  const newDate = new Date();
  const fullDate = `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`;

  return fullDate;
};

export const fullDate = getNewDate();

export const handleTitleChange = (): void => {
  console.log("okokoko");
};
