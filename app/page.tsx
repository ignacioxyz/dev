'use client'

import { useEffect, useState } from "react";

const hashMapWords = (text: string) => {
    const hashMap = new Map<string, number>();
    const words = text.toLowerCase().split(/\s+|[.,!?]/).filter(word => word.length > 0);
    for (const word of words) {
        hashMap.set(word, (hashMap.get(word) || 0) + 1);
    }
    return hashMap;
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [wordCount, setWordCount] = useState<Map<string, number> | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/proxy');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            setData(data);
            const words = hashMapWords(data);
            console.log(words);
            
            const sortedWords = new Map([...words.entries()].sort((a, b) => b[1] - a[1]));
            const mostFrequentWord = sortedWords.entries().next().value;
            console.log("mostFrequentWord", mostFrequentWord);

            setWordCount(new Map([[mostFrequentWord[0], mostFrequentWord[1]]]));

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4 max-w-prose mx-auto">
            {loading && <p className="text-gray-600">Loading...</p>}
            {!loading && !error && wordCount && (
                <div className="p-5 border border-gray-300 rounded-md mb-5">
                    <p className="text-gray-600">
                        The most frequent word is: <span className="font-bold">"{Array.from(wordCount.keys())[0]}"</span> with <span className="font-bold">{Array.from(wordCount.values())[0]} occurrences</span>
                    </p>
                </div>
            )}
            {!loading && !error && <pre className="whitespace-pre-wrap">{data}</pre>}
        </div>
    )
}
