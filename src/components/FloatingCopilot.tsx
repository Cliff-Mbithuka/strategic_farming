import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Bot, User, Maximize2, Minimize2, Sparkles, GripVertical, Zap, TrendingUp } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useCopilot } from "./CopilotContext";
import { Badge } from "./ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function FloatingCopilot() {
  const { suggestedQuestion, setSuggestedQuestion, contextData } = useCopilot();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AgriCopilot AI. I can see what you're viewing and provide instant insights. Try clicking on any card or metric!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const copilotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (suggestedQuestion && suggestedQuestion !== inputValue) {
      setInputValue(suggestedQuestion);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
  }, [suggestedQuestion]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (copilotRef.current) {
      const rect = copilotRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setSuggestedQuestion("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(messageText, contextData);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const generateResponse = (question: string, context?: Record<string, any>): string => {
    const lowerQuestion = question.toLowerCase();

    // Context-aware responses based on clicked elements
    if (lowerQuestion.includes("credit points")) {
      return "💎 You currently have 1,247 credit points (Gold Member)!\n\n✨ Ways to earn more:\n• Follow AI recommendations: +100pts\n• Collaborate with neighbors: +200pts\n• Sustainable farming practices: +180pts\n• Complete weekly goals: +150pts\n\n🎯 You're 353 points away from Platinum status, which unlocks premium market access and exclusive partnerships!";
    } else if (lowerQuestion.includes("farm health")) {
      return "🌟 Your farm health is excellent at 94%!\n\nThis score is calculated from:\n• Soil conditions: 98% optimal\n• Crop vitality: 92%\n• Pest management: 88%\n• Weather alignment: 96%\n\n💡 Tip: Address the minor pest risk in Zones A&B to reach 98% overall health!";
    } else if (lowerQuestion.includes("active neighbors")) {
      return "👥 You have 23 active farmers in your network!\n\nTop collaboration opportunities:\n1. Sarah (2km) - Joint pest control saves KSH 67,500\n2. Mike (3km) - Equipment sharing earns +200pts\n3. Lisa (5km) - Market coordination adds 15% revenue\n\n🤝 Coordinating with all 3 = +530 points + KSH 180,000 in savings!";
    } else if (lowerQuestion.includes("nearest market") || lowerQuestion.includes("green valley")) {
      return "🏪 Green Valley Market (12km away)\n\nCurrent demand:\n• Tomatoes: KSH 675/kg (HIGH) +7.1%\n• Peppers: KSH 870/kg (MEDIUM) +5.5%\n• Wheat: KSH 480/kg (STABLE)\n\n📊 Your projected revenue this week: KSH 427,500\n💡 Transport cost optimization available - save KSH 18,000 by coordinating with neighbors!";
    } else if (lowerQuestion.includes("weather forecast") || lowerQuestion.includes("7-day")) {
      return "🌤️ 7-Day Intelligent Forecast:\n\nToday: Clear 28°C - Perfect for field work\nTomorrow: Cloudy 26°C - Good for planting\nMonday: Rain 23°C ⚠️ OPTIMAL PLANTING WINDOW\nTuesday: Windy 25°C - Avoid spraying\n\n💡 AI Insight: Monday's rain creates ideal conditions for tomato planting. Soil moisture will reach 85% - perfect for germination!";
    } else if (lowerQuestion.includes("soil conditions")) {
      return "🌱 Soil Analysis (Satellite-verified):\n\nZone A: 92% optimal\n• Moisture: 78% ✓\n• Nitrogen: 65% ✓\n• pH: 6.5 ✓\n• Temp: 22°C ✓\n\nZone B: Similar conditions\nZone C: 88% optimal (needs compost)\nZone D: Fallow (recovering)\n\n💡 Monday's rain will boost moisture to 85% - ideal for new plantings!";
    } else if (lowerQuestion.includes("ai recommendations") || lowerQuestion.includes("this week")) {
      return "🎯 Your Personalized Action Plan:\n\n🔴 HIGH PRIORITY:\nPlant tomatoes in next 5 days. Market price at peak (KSH 675/kg), conditions perfect. Potential profit: KSH 480,000.\n\n🔵 MEDIUM:\nCollaborate with 3 neighbors on pest control. Saves KSH 67,500, earns +200 points.\n\n🟡 WATCH:\nPest risk increasing 12%. Apply preventive treatment within 48hrs to avoid crop loss.\n\n✅ All recommendations backed by satellite data + market intelligence.";
    } else if (lowerQuestion.includes("satellite") || lowerQuestion.includes("thermal") || lowerQuestion.includes("ndvi")) {
      return "🛰️ Satellite Intelligence Active:\n\nNDVI Analysis: Crop health at 92%\nThermal Mapping: Optimal growth temps detected\nMoisture Sensing: 78% across all zones\n\n📊 AI detected:\n• Healthy vegetation in Zones A&B\n• Growth opportunity in Zone C\n• Perfect recovery in Zone D\n\n💡 Satellite updates every 6 hours for real-time precision!";
    } else if (lowerQuestion.includes("tomato")) {
      return "🍅 Tomato Intelligence Report:\n\nOptimal planting window: Oct 10-20 (next 5 days!)\nRecommended zone: Zone C\nConditions: PERFECT\n• Soil temp: 22°C ✓\n• Moisture: 78% ✓\n• pH: 6.5 ✓\n\nExpected yield: 25-30 tons/ha\nMarket price: KSH 675/kg (+7.1% ↑)\nProjected revenue: KSH 480,000\n\n💰 ROI: 340% | Risk: LOW";
    } else if (lowerQuestion.includes("pest")) {
      return "🐛 Pest Intelligence Alert:\n\n⚠️ HIGH RISK: Aphid activity detected\nAffected zones: A & B\nRisk level: 78%\nPeak period: Oct 8-12\n\n🛡️ Recommended actions:\n1. Apply neem oil treatment (organic)\n2. Coordinate with neighbors (+200pts)\n3. Monitor daily via satellite\n\n💡 Early treatment = 95% success rate!";
    } else if (lowerQuestion.includes("market") || lowerQuestion.includes("price")) {
      return "💰 Market Intelligence:\n\nHIGH DEMAND:\n• Tomatoes: KSH 4.50/kg (+7.1%) 📈\n• Peppers: KSH 5.80/kg (+5.5%) 📈\n\nSTABLE:\n• Wheat: KSH 3.20/kg\n• Corn: KSH 2.80/kg\n\nNearest market: Green Valley (12km)\nYour revenue potential: KSH 2,850/week\n\n🚚 Pro tip: Coordinate transport with neighbors = save KSH 120!";
    } else if (lowerQuestion.includes("neighbor") || lowerQuestion.includes("collaborate")) {
      return "🤝 Collaboration Opportunities:\n\n1. Joint Pest Control\n   Partners: Sarah, Mike\n   Savings: KSH 450\n   Points: +200\n\n2. Equipment Rental\n   Partner: Lisa\n   Savings: KSH 300\n   Points: +150\n\n3. Market Coordination\n   Partners: All 3\n   Revenue boost: +15%\n   Points: +180\n\n💎 Total value: +530 points + KSH 1,200 savings!";
    } else if (lowerQuestion.includes("point") || lowerQuestion.includes("credit")) {
      return "💎 Credit System Overview:\n\nYour balance: 1,247 points\nRank: Gold Member\nNext rank: Platinum (1,600pts)\nNeeded: 353 points\n\n⭐ Earn points:\n• AI recommendations: +100\n• Neighbor collaboration: +200\n• Sustainable practices: +180\n• Weekly goals: +150\n\n🎁 Platinum unlocks: Premium markets, partnerships, 20% discounts!";
    } else if (lowerQuestion.includes("zone")) {
      return "🗺️ Farm Zone Intelligence:\n\nZone A: 15 acres - Wheat (Healthy 94%)\nZone B: 12 acres - Corn (Healthy 91%)\nZone C: 8 acres - Vegetables (Good 88%)\nZone D: 10 acres - Fallow (Recovery mode)\n\n💡 Live satellite monitoring shows optimal conditions in A&B. Zone C ready for new tomato planting!";
    } else {
      return "🤖 I'm your intelligent AgriCopilot!\n\n✨ I can help you with:\n• 🌾 Crop planning & recommendations\n• 🌤️ Weather predictions & timing\n• 💰 Market prices & revenue optimization\n• 🐛 Pest detection & prevention\n• 🌱 Soil health & satellite data\n• 🤝 Neighbor collaboration\n• 💎 Credit points & rewards\n\n💡 Try clicking on any card or metric on your dashboard - I'll instantly provide detailed insights!";
    }
  };

  return (
    <div
      ref={copilotRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: isDragging ? 'none' : 'auto',
        width: isExpanded ? '400px' : '380px'
      }}
    >
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300">
        {/* Header - Draggable */}
        <div
          className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 cursor-move flex items-center justify-between"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center relative">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Zap className="h-3 w-3 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">AgriCopilot AI</p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs px-1.5 py-0">
                  SMART
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-green-300">Context-Aware</span>
                <TrendingUp className="h-3 w-3 text-green-400" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <GripVertical className="h-4 w-4 text-white/50" />
          </div>
        </div>

        {/* Messages - Only show when expanded */}
        {isExpanded && (
          <ScrollArea ref={scrollRef} className="h-72 bg-gray-950/50 p-4">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                    message.role === "user" 
                      ? "bg-blue-600" 
                      : "bg-gradient-to-br from-green-500 to-green-600"
                  }`}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-xl p-3 text-xs ${
                      message.role === "user"
                        ? "bg-blue-600 text-white ml-8"
                        : "bg-gray-800/80 text-gray-100 mr-8 border border-gray-700/50"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 rounded-xl p-3 bg-gray-800/80 mr-8 border border-gray-700/50">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input - Always visible */}
        <div className="p-3 bg-gray-900/80 border-t border-gray-700/50">
          <div className="mb-2">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {isExpanded ? "Ask anything or click elements on your dashboard" : "Click any card for instant insights"}
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type or click dashboard elements..."
              className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all"
            />
            <Button 
              size="icon"
              onClick={() => handleSend()} 
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
