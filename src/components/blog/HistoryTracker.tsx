'use client'
import { useEffect } from "react";
import { useHistory } from "../layout/HistoryContext";

export function HistoryTracker({postId} : {postId : number}) : null {
    const { addToHistory } = useHistory()
    useEffect(() => {
        addToHistory(postId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId])

    return null
}
