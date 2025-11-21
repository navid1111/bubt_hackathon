import { useAuth } from '@clerk/clerk-react';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Calendar,
  Clock,
  DollarSign,
  Leaf,
  Lightbulb,
  MessageSquare,
  Target,
  TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DashboardInsight {
  consumption?: any;
  impact?: any;
  waste?: any;
}

interface AIResponse {
  success: boolean;
  response?: string;
  data?: any;
  insights?: string;
  toolsUsed?: number;
}

const IntelligentDashboard: React.FC = () => {
  const { getToken } = useAuth();
  const [insights, setInsights] = useState<DashboardInsight>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<AIResponse | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchDashboardInsights();
  }, []);

  const fetchDashboardInsights = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/intelligence/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.data.insights || {});
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    setChatLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/intelligence/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: chatQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatResponse(data.data);
        setChatQuery('');
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      setChatResponse({
        success: false,
        response: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setChatLoading(false);
    }
  };

  const fetchSpecificInsight = async (
    endpoint: string,
    setter?: (data: any) => void,
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/intelligence/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (setter) setter(data.data);
        return data.data;
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AI Intelligence Dashboard
                </h1>
                <p className="text-gray-600">
                  Personalized insights and recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'consumption', label: 'Consumption', icon: TrendingUp },
                { id: 'waste', label: 'Waste Prevention', icon: AlertTriangle },
                { id: 'nutrition', label: 'Nutrition', icon: Target },
                { id: 'impact', label: 'Impact', icon: Leaf },
                { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">
                    Consumption Score
                  </h3>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {insights.consumption?.patterns?.consistencyScore || 0}%
                </div>
                <p className="text-sm text-gray-600">Tracking consistency</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-gray-900">Items at Risk</h3>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {insights.waste?.summary?.totalAtRisk || 0}
                </div>
                <p className="text-sm text-gray-600">Expiring soon</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">CO₂ Saved</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {insights.impact?.impact?.environmental?.co2Saved || 0}kg
                </div>
                <p className="text-sm text-gray-600">This month</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Money Saved</h3>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${insights.impact?.impact?.financial?.moneySaved || 0}
                </div>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Consumption Analysis',
                      description: 'Analyze your eating patterns',
                      icon: TrendingUp,
                      action: () =>
                        fetchSpecificInsight('consumption-analysis'),
                    },
                    {
                      title: 'Waste Prediction',
                      description: 'Predict upcoming waste',
                      icon: AlertTriangle,
                      action: () => fetchSpecificInsight('waste-prediction'),
                    },
                    {
                      title: 'Meal Plan Optimization',
                      description: 'Get AI-optimized meal plans',
                      icon: Calendar,
                      action: () => setActiveTab('nutrition'),
                    },
                    {
                      title: 'Nutrition Analysis',
                      description: 'Check nutrient gaps',
                      icon: Target,
                      action: () => fetchSpecificInsight('nutrition-analysis'),
                    },
                    {
                      title: 'Impact Analytics',
                      description: 'See your environmental impact',
                      icon: Leaf,
                      action: () => fetchSpecificInsight('impact-analytics'),
                    },
                    {
                      title: 'Get Recommendations',
                      description: 'Personalized suggestions',
                      icon: Lightbulb,
                      action: () => fetchSpecificInsight('recommendations'),
                    },
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <action.icon className="w-5 h-5 text-purple-600" />
                        <h3 className="font-medium text-gray-900">
                          {action.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  AI Assistant
                </h2>
                <p className="text-gray-600">
                  Ask me anything about your food management, nutrition, or
                  waste reduction!
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleChatSubmit} className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={chatQuery}
                      onChange={e => setChatQuery(e.target.value)}
                      placeholder="Ask me about your consumption patterns, waste prediction, meal planning..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatQuery.trim()}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {chatLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Thinking...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          Ask AI
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {chatResponse && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            AI Assistant
                          </h4>
                          {chatResponse.toolsUsed && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                              Used {chatResponse.toolsUsed} analysis tools
                            </span>
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {chatResponse.response}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Example Questions */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Try asking:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      'What are my consumption patterns this month?',
                      'Which items might go to waste soon?',
                      'Create an optimized meal plan for this week',
                      'What nutrient gaps do I have?',
                      'Show me my environmental impact',
                      'Find local food sharing opportunities',
                    ].map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setChatQuery(question)}
                        className="text-left p-3 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly with specific content */}
        {activeTab !== 'overview' && activeTab !== 'chat' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{' '}
                Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                This section will show detailed {activeTab} insights and
                analytics.
              </p>
              <button
                onClick={() =>
                  fetchSpecificInsight(
                    activeTab === 'consumption'
                      ? 'consumption-analysis'
                      : activeTab === 'waste'
                      ? 'waste-prediction'
                      : activeTab === 'nutrition'
                      ? 'nutrition-analysis'
                      : 'impact-analytics',
                  )
                }
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Generate{' '}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentDashboard;
