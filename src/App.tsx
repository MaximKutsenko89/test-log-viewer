import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { LOCAL_URL, TOTAL_SIZE } from "./constants";
import useWebSocket from "./hooks/useWebSocket";

const title = document.title;

export default function App() {
  const { logs, size } = useWebSocket(LOCAL_URL);
  const listRef = useRef<List>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  useEffect(() => {
    if (listRef.current && autoScrollEnabled) {
      listRef.current.scrollToItem(logs.length - 1, "end");
    }
  }, [logs, autoScrollEnabled]);

  const downLoadProgress = Number(
    ((size.current / TOTAL_SIZE) * 100).toFixed(2)
  );

  useEffect(() => {
    if (downLoadProgress > 0) {
      document.title = `${downLoadProgress}%`;
    }
    return () => {
      document.title = title;
    };
  }, [downLoadProgress]);

  return (
    <main className="container">
      <List
        height={500}
        itemCount={logs.length}
        itemSize={35}
        width={"100%"}
        ref={listRef}
        className="logs-container"
      >
        {({ index, style }) => (
          <div className="list-item" style={style}>
            {index + 1}: {logs[index]}
          </div>
        )}
      </List>
      <button
        onClick={() => setAutoScrollEnabled((prev) => !prev)}
        className={`toggle-scroll ${autoScrollEnabled ? "" : "disabled"}`}
      />
    </main>
  );
}
