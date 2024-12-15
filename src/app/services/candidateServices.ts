"use client"
import axios from "axios";
import ICandidate from "../types/candidate";
import IUser from "../types/user";
import IEmployee from "../types/employee";
import { supabase } from "../lib/supabase/supabaseClient";

export const getCandidate = async (email: string | null) => {
  try {
    const response = await axios.get(`/api/candidate/${email}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error getting Candidate:", error);
    throw error;
  }
};

export const createCandidate = async (candidate: ICandidate) => {
  try {
    const response = await axios.post("/api/signup", candidate);
    const data = response.data;

    if (data.message === "Candidate created successfully") {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error creating candidate:", error);
    return {
      success: false,
      message: "Candidate with this username or email already exists",
    };
  }
};
export const updateCandidate = async (
  email: string,
  candidate: (IUser & ICandidate) | (IUser & IEmployee) | null
) => {
  try {
    console.log("cccccccc", candidate);
    const response = await axios.put(`/api/candidate/${email}`, candidate);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error updating candidate:", error);
  }
};

export const uploadResume = async (file: File): Promise<string | null> => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }
  if (data?.path) {
    const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      console.error("Error retrieving public URL.");
      return null;
    }
   
    console.log('Public URL:', publicUrlData, "hii");
    return publicUrlData.publicUrl;
  }
  return null;
};
