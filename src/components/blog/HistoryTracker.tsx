'use client'
import { useEffect } from "react";
import { useHistory } from "../layout/HistoryContext";

export function HistoryTracker({postId} : {postId : number}) : null {
    const {history, addToHistory} = useHistory()
    useEffect(() => {
        addToHistory(postId)
    }, [])

    return null
}
