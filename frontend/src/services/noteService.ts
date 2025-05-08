import axios from "@/configs/axiosConfig";

interface CreateNoteData {
  lessonId: string;
  courseId: string;
  content: string;
  position: number;
}

export const createNote = async (data: CreateNoteData) => {
  try {
    const response = await axios.post("/notes", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const response = await axios.delete(`/notes/${noteId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateNote = async (noteId: string, data: CreateNoteData) => {
  try {
    const response = await axios.put(`/notes/${noteId}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
