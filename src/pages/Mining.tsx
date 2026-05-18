import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Play, Pause, TrendingUp, Zap, Cpu, Wallet } from "lucide-react";
import arxonLogo from "@/assets/arxon-icon.svg";

const Mining = () => {
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isMining) {
      // Animate hash rate increase
      const hashInterval = setInterval(() => {
        setHashRate(prev => Math.min(prev + Math.random() * 0.5, 15.8));
      }, 100);

      // Simulate block mining
      const blockInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          setBlocks(prev => prev + 1);
          setEarnings(prev => prev + Math.random() * 2);
        }
      }, 2000);

      // Generate particles
      const particleInterval = setInterval(() => {
        const newParticles = Array.from({ length: 3 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2
        }));
        setParticles(prev => [...prev.slice(-20), ...newParticles]);
      }, 500);

      return () => {
        clearInterval(hashInterval);
        clearInterval(blockInterval);
        clearInterval(particleInterval);
      };
    } else {
      setHashRate(0);
    }
  }, [isMining]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#0a0e1a]">
        <AppSidebar />
        <main className="flex-1 relative overflow-hidden">
          {/* Animated starfield background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 2 + 2}s`
                }}
              />
            ))}
          </div>

          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-primary/10 bg-[#0a0e1a]/95 backdrop-blur px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Mining</h1>
          </header>
          
          <div className="relative z-10 p-6 space-y-6 max-w-4xl mx-auto">
            {/* Balance Display */}
            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <div className="flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6 text-primary" />
                <span className="text-5xl font-bold gradient-text">
                  {earnings.toFixed(2)}
                </span>
                <span className="text-2xl text-primary font-semibold">$ARX</span>
              </div>
            </div>

            {/* Mining Visualization */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Particle effects when mining */}
                {isMining && (
                  <div className="absolute inset-0 pointer-events-none">
                    {particles.map(particle => (
                      <div
                        key={particle.id}
                        className="absolute w-1.5 h-1.5 bg-primary rounded-full"
                        style={{
                          left: `${particle.x}%`,
                          top: `${particle.y}%`,
                          animation: `fade-in 1.5s ease-out forwards`,
                          animationDelay: `${particle.delay}s`,
                          boxShadow: '0 0 10px hsl(var(--primary))'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Radioactive glow rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-full rounded-full ${isMining ? 'animate-pulse' : ''}`}
                    style={{
                      boxShadow: isMining 
                        ? '0 0 60px 20px hsl(var(--primary) / 0.3), 0 0 100px 40px hsl(var(--primary) / 0.2), 0 0 140px 60px hsl(var(--primary) / 0.1)'
                        : '0 0 30px 10px hsl(var(--primary) / 0.1)',
                      transition: 'box-shadow 0.5s ease',
                      animationDuration: '2s'
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-full rounded-full border-2 ${isMining ? 'border-primary/40 animate-spin' : 'border-primary/10'}`} 
                    style={{ animationDuration: '20s' }} 
                  />
                </div>
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className={`w-full h-full rounded-full border-2 ${isMining ? 'border-primary/30 animate-spin' : 'border-primary/5'}`} 
                    style={{ animationDuration: '15s', animationDirection: 'reverse' }} 
                  />
                </div>

                {/* Main circle with gradient */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border-4 ${isMining ? 'border-primary/50' : 'border-primary/20'} transition-all duration-300`}
                    style={{
                      boxShadow: isMining 
                        ? '0 0 40px hsl(var(--primary) / 0.4), inset 0 0 60px hsl(var(--primary) / 0.1)'
                        : '0 0 20px hsl(var(--primary) / 0.2)'
                    }}
                  >
                    {/* Dotted ring */}
                    {isMining && (
                      <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                          cx="50%"
                          cy="50%"
                          r="48%"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          strokeDasharray="4 8"
                          className="animate-spin"
                          style={{ animationDuration: '10s' }}
                        />
                      </svg>
                    )}
                    
                    {/* Logo in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={arxonLogo} 
                        alt="ARXON" 
                        className={`w-72 h-72 ${isMining ? 'animate-float' : ''}`}
                        style={{
                          filter: isMining 
                            ? 'drop-shadow(0 0 50px hsl(var(--primary))) brightness(1.3)' 
                            : 'drop-shadow(0 0 20px hsl(var(--primary)/0.4))',
                          transition: 'filter 0.5s ease'
                        }}
                      />
                    </div>

                    {/* Energy indicator */}
                    {isMining && (
                      <div className="absolute top-8 right-8">
                        <Zap className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mining Controls */}
              <div className="text-center mt-8 space-y-4">
                {!isMining ? (
                  <>
                    <h2 className="text-2xl font-bold gradient-text mb-2">
                      Ready to Mine $ARX
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Tap to start mining and earn rewards
                    </p>
                    <Button 
                      onClick={() => setIsMining(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-12 py-6 rounded-full shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.6)] transition-all"
                    >
                      <Play className="mr-2 h-6 w-6" />
                      Start Mining
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold gradient-text animate-pulse mb-2">
                      Mining Active
                    </h2>
                    <p className="text-sm text-primary/80 mb-6">
                      Your rig is generating $ARX tokens
                    </p>
                    <Button 
                      onClick={() => setIsMining(false)}
                      variant="outline" 
                      className="border-2 border-primary/30 text-primary hover:bg-primary/10 text-lg px-12 py-6 rounded-full"
                    >
                      <Pause className="mr-2 h-6 w-6" />
                      Stop Mining
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mining Stats */}
            <div className="grid gap-4 md:grid-cols-3 pt-6">
              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Cpu className="w-4 h-4" />
                    <span>Hash Rate</span>
                  </div>
                  <div className="text-3xl font-bold gradient-text">
                    {hashRate.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">TH/s</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Zap className="w-4 h-4" />
                    <span>Blocks Mined</span>
                  </div>
                  <div className="text-3xl font-bold gradient-text">{blocks}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total found</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Rate</span>
                  </div>
                  <div className="text-3xl font-bold gradient-text">
                    +{(hashRate * 0.127).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">$ARX per hour</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Mining;
