import { MessageSquare, Users, Zap } from "lucide-react";

interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

const AuthImagePattern = ({ title, subtitle }: AuthImagePatternProps) => {
  const features = [
    { icon: MessageSquare, label: "Chat", delay: "0s" },
    { icon: Users, label: "Connect", delay: "0.2s" },
    // { icon: Heart, label: "Share", delay: "0.4s" },
    { icon: Zap, label: "Instant", delay: "0.6s" },
    // { icon: Sparkles, label: "Magic", delay: "0.8s" },
    // { icon: Globe, label: "Global", delay: "1s" },
  ];

  return (
    <div
      className="hidden h-full md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-800 via-purple-800 to-cyan-900
 relative overflow-hidden"
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {/* Animated geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse"></div>
        <div
          className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-lg rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-12 h-12 bg-white/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 right-10 w-24 h-24 border-2 border-white rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-8 h-8 bg-white/40 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Additional floating elements */}
        <div
          className="absolute top-20 right-1/3 w-6 h-6 bg-white/20 rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/2 w-14 h-14 border border-white rounded-lg rotate-12 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white space-y-8 max-w-lg">
        {/* Enhanced Icon Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={i}
                className="group bg-white/15 backdrop-blur-lg p-6 rounded-2xl hover:bg-white/25 transition-all duration-500 hover:scale-105 hover:shadow-xl border border-white/10"
                style={{
                  animationDelay: feature.delay,
                  animation: `fade-in 0.6s ease-out both`,
                }}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                  {feature.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Enhanced Text Content */}
        <div className="space-y-6">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl xl:text-2xl text-white/90 leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        {/* Enhanced Stats with Animation
        <div className="flex justify-center gap-12 pt-8">
          {[
            { value: "10K+", label: "Users", delay: "0.5s" },
            { value: "50K+", label: "Messages", delay: "0.7s" },
            { value: "99%", label: "Uptime", delay: "0.9s" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center transform hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: stat.delay,
                animation: `fade-in 0.8s ease-out both`,
              }}
            >
              <div className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-white/80 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default AuthImagePattern;
