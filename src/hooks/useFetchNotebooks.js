import { useState, useEffect } from "react";
import { getItemFromAsyncStorage } from "../utils/asyncStorageHelper";

const useFetchNotebooks = (isFocused, currentModal) => {
  const [noteBookList, setNoteBookList] = useState([]);

  useEffect(() => {
    const getNotebooks = async () => {
      const currentNotebookList = await getItemFromAsyncStorage("Notes");
      setNoteBookList(currentNotebookList);
    };

    getNotebooks();
  }, [isFocused, currentModal]);

  return { noteBookList, setNoteBookList };
};

export default useFetchNotebooks;
