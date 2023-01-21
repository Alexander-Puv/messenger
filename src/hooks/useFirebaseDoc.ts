import { FirebaseError } from "firebase/app";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { FirebaseContext } from "../MainConf";
import { Error, GetDoc, useFirebaseDocReturn } from "../types/useFirebaseDocTypes";

/**
 * @returns getDoc function, isLoading state and error if it occures
 */
export const useFirebaseDoc = (): useFirebaseDocReturn => {
  const {firestore} = useContext(FirebaseContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>(null)

  /** 
   * This funcion gets document and pass it to functions (func param)
   * @param collectionName - The name of the collection where required document stores
   * @param field - The path to compare
   * @param value - The value for comparison
   * @param func - The function that receives document from query
   */
  const getDoc: GetDoc = async (collectionName, field, value, func) => {
    try {
      setIsLoading(true)
      const q = query(collection(firestore, collectionName), where(field, '==', value))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (d) => {
        func(d)
      });
    } catch (e) {
      e instanceof FirebaseError && setError(e.message)
    }
    setIsLoading(false)
  }

  return [
    getDoc,
    isLoading,
    error
  ]
}