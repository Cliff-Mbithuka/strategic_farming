import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Send, Bot, User, Sparkles, Lightbulb, Calendar, TrendingUp } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AgriCopilot AI assistant. I can help you with crop selection, planting schedules, pest management, market insights, and farming best practices. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { icon: Calendar, text: "What's the best time to plant tomatoes?", category: "Planting" },
    { icon: TrendingUp, text: "Which crops have high market demand?", category: "Market" },
    { icon: Lightbulb, text: "How can I improve soil quality?", category: "Soil" },
    { icon: Sparkles, text: "Recommend crops for my land", category: "Recommendation" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(messageText);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("tomato")) {
      return "Based on your location and current soil data, the optimal planting window for tomatoes is between October 10-20, 2025. Your soil temperature (22°C) and moisture levels (78%) are ideal. Satellite data shows your Zone C would be perfect. Expected yield: 25-30 tons/hectare. Market price is currently KSH 4.50/kg with increasing demand. Would you like specific planting instructions?";
    } else if (lowerQuestion.includes("market") || lowerQuestion.includes("demand")) {
      return "Current high-demand crops in your area:\n\n1. Tomatoes - KSH 4.50/kg (+7.1% trend) at Green Valley Market (12km)\n2. Peppers - KSH 5.80/kg (+5.5% trend) at Central City (28km)\n3. Organic Wheat - KSH 1.20/kg at Farmer's Co-op (18km)\n\nBased on your current crops, I recommend harvesting your tomatoes now to capitalize on the price surge. You could earn approximately KSH 2,850. Would you like buyer recommendations?";
    } else if (lowerQuestion.includes("soil")) {
      return "Your current soil analysis shows:\n• Moisture: 78% (optimal)\n• pH: 6.5 (ideal for most crops)\n• Nitrogen: 65% (good)\n\nTo improve soil quality, I recommend:\n1. Add organic compost in Zone C (lower nitrogen)\n2. Consider cover cropping in fallow Zone D\n3. Rotate crops seasonally to prevent nutrient depletion\n4. The upcoming rain (Monday) is perfect for applying amendments\n\nWould you like specific fertilizer recommendations?";
    } else if (lowerQuestion.includes("recommend") || lowerQuestion.includes("crop")) {
      return "Based on your farm's geospatial data, soil conditions, and market analysis, here are my recommendations:\n\n**Zone A (12.5 ha):** Continue wheat, excellent conditions\n**Zone B (9.2 ha):** Plant corn or soybeans - high market demand\n**Zone C (6.5 ha):** Perfect for tomatoes or peppers - premium prices\n**Zone D (4.3 ha):** Rest or plant nitrogen-fixing legumes\n\nThis mix optimizes for:\n✓ Soil health (crop rotation)\n✓ Market demand (high-value crops)\n✓ Risk diversification\n✓ Expected revenue: KSH 12,500-15,000\n\nWant detailed planting schedules?";
    } else if (lowerQuestion.includes("pest")) {
      return "Current pest risk assessment:\n\n⚠️ HIGH: Aphids in Zones A & B (78% risk)\n• Peak: Oct 8-12\n• Action: Apply neem oil spray immediately\n• Collaborate with 3 neighbors for coordinated treatment (+200 points)\n\n⚡ MEDIUM: Corn borers in Zone B (45% risk)\n• Monitoring recommended\n• Set pheromone traps\n\n✅ LOW: Other pests\n\nWeather conditions (85% humidity) are favorable for aphid breeding. Early intervention is crucial. Shall I create a treatment schedule?";
    } else if (lowerQuestion.includes("weather")) {
      return "7-day forecast for your farm:\n\n**Today:** Sunny, 28°C/18°C, 65% humidity - Perfect for fieldwork\n**Tomorrow:** Partly cloudy, 26°C/17°C - Good conditions\n**Monday:** Light rain expected, 23°C/16°C - Ideal for planting\n**Tuesday-Thursday:** Windy and clear, 25°C/15°C\n\nRecommendation: Plan planting for Monday after the rain. Soil moisture will be optimal. Avoid pesticide application on Tuesday due to wind. Want a detailed activity schedule?";
    } else if (lowerQuestion.includes("collaborate") || lowerQuestion.includes("neighbor")) {
      return "Great timing! There are 3 active collaboration opportunities:\n\n1. **Joint Pest Control** (+200 points)\n   Partners: Maria Santos, Ana Rodriguez\n   Benefit: Coordinated aphid treatment, 30% cost reduction\n\n2. **Bulk Equipment Rental** (+150 points)\n   Partners: David Chen, Priya Patel\n   Benefit: KSH 800 savings per farmer\n\n3. **Market Coordination** (+180 points)\n   Partners: Maria Santos, James Wilson\n   Benefit: 15% better prices through collective bargaining\n\nJoining all three could earn you 530 credit points and save KSH 1,200. Interested?";
    } else if (lowerQuestion.includes("fertilizer")) {
      return "Fertilizer recommendations based on soil analysis:\n\n**Zone A (Wheat):**\n• NPK 20-10-10, 150 kg/ha\n• Apply in 2 split doses\n• Next application: Oct 15\n\n**Zone B (Corn):**\n• NPK 15-15-15, 200 kg/ha\n• Add zinc supplement (5 kg/ha)\n\n**Zone C (Vegetables):**\n• Organic compost preferred\n• NPK 10-20-20 for flowering\n\nMonday's rain is perfect timing for application. Cost estimate: KSH 850. You can save 20% by coordinating purchase with neighbors. Want supplier contacts?";
    } else if (lowerQuestion.includes("water") || lowerQuestion.includes("irrigation")) {
      return "Irrigation analysis for your farm:\n\nCurrent soil moisture: 78% (good)\n\n**This Week:**\n• No irrigation needed until Thursday\n• Rain expected Monday (22mm)\n• Zones A & B: Well hydrated\n• Zone C: May need light irrigation Thursday\n\n**Recommendations:**\n• Install drip irrigation in Zone C (vegetables need consistent moisture)\n• Current system efficiency: 72%\n• Potential water savings: 30% with upgrades\n\nEstimated water usage this month: 45,000 liters. Want efficiency improvement suggestions?";
    } else {
      return "I understand you're asking about farming practices. I can help you with:\n\n• Crop selection and recommendations\n• Planting schedules and timing\n• Soil health and fertilizer advice\n• Pest and disease management\n• Weather forecasting and planning\n• Market prices and selling strategies\n• Irrigation and water management\n• Collaboration opportunities\n\nCould you please be more specific about what you'd like to know? Or choose from the suggested questions above!";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>AgriCopilot - AI Assistant</h1>
        <p className="text-muted-foreground">
          Get expert farming advice powered by AI and real-time data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>Chat with AI Copilot</CardTitle>
            </div>
            <CardDescription>Ask anything about farming, crops, markets, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages Area */}
              <ScrollArea ref={scrollRef} className="h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-green-600 text-white"
                      }`}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`flex-1 rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-12"
                            : "bg-secondary mr-12"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === "user" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1 rounded-lg p-4 bg-secondary mr-12">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about crops, weather, markets..."
                  className="flex-1"
                />
                <Button onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suggested Questions</CardTitle>
              <CardDescription>Click to ask</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => {
                const Icon = question.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleSend(question.text)}
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{question.text}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {question.category}
                      </Badge>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Real-time Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      Uses your satellite and soil data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Market Intelligence</p>
                    <p className="text-xs text-muted-foreground">
                      Live pricing and demand forecasts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Expert Knowledge</p>
                    <p className="text-xs text-muted-foreground">
                      Trained on agricultural best practices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Personalized Advice</p>
                    <p className="text-xs text-muted-foreground">
                      Based on your specific farm conditions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-base">💡 Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The more specific your question, the better the advice. Include details like crop types, zones, or timeframes for optimal results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
