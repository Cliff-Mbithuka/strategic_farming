import { createContext, useContext, useState, ReactNode } from "react";

interface CopilotContextType {
  suggestedQuestion: string;
  setSuggestedQuestion: (question: string) => void;
  contextData: Record<string, any>;
  setContextData: (data: Record<string, any>) => void;
  handleElementClick: (elementName: string, data?: Record<string, any>) => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [suggestedQuestion, setSuggestedQuestion] = useState("");
  const [contextData, setContextData] = useState<Record<string, any>>({});

  const handleElementClick = (elementName: string, data?: Record<string, any>) => {
    setSuggestedQuestion(`Do you want to know more about ${elementName}?`);
    if (data) {
      setContextData(data);
    }
  };

  return (
    <CopilotContext.Provider
      value={{
        suggestedQuestion,
        setSuggestedQuestion,
        contextData,
        setContextData,
        handleElementClick
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error("useCopilot must be used within CopilotProvider");
  }
  return context;
}
