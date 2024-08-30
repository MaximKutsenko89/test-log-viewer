import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url: string) {
  const [logs, setLogs] = useState<string[]>([]);
  const bufferRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);
  const sizeRef = useRef(0);
  useEffect(() => {
    const socket = new WebSocket(url);

    function onOpen() {
      socket.send("Hello Server!");
      console.log("Connection established");
    }

    function processBuffer() {
      if (bufferRef.current.length > 0 && !isProcessingRef.current) {
        isProcessingRef.current = true;
        setLogs((prevLogs) => [...prevLogs, ...bufferRef.current]);
        bufferRef.current = [];
        isProcessingRef.current = false;
      }
    }

    function onMessage(event: MessageEvent) {
      const message = event.data;
      bufferRef.current.push(message);
      const messageSize = new TextEncoder().encode(message).length; // size in bytes
      sizeRef.current += messageSize;

      if (bufferRef.current.length >= 1000) {
        processBuffer();
      }
    }

    function onClose() {
      console.log("Connection closed");
    }

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("close", onClose);

    const intervalId = setInterval(() => {
      processBuffer();
    }, 1000);

    return () => {
      clearInterval(intervalId);
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("close", onClose);
      socket.close();
    };
  }, [url]);

  return { logs, size: sizeRef };
}
