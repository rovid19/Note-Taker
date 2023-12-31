interface functionObject {
  fullDate: string;
  monthYear: string;
}

const getDate = (): functionObject => {
  const newDate = new Date();
  const month = newDate.toLocaleString("default", { month: "long" });
  const fullDate = `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
  const monthYear = `${newDate.getFullYear()} ${month}`;
  return { fullDate: fullDate, monthYear: monthYear };
};

export const fullDate = getDate().fullDate;
export const monthYear = getDate().monthYear;
