import { useState, useEffect } from 'react';
import { Moon, Smartphone, DollarSign, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepCard } from '@/components/StepCard';
import { CopyButton } from '@/components/CopyButton';
import { CodeBlock } from '@/components/CodeBlock';
import { ReferralDashboard } from '@/components/ReferralDashboard';
import nightSkyHero from '@/assets/night-sky-hero.jpg';
import nightMovesLogo from '@/assets/night-moves-logo.png';

const Index = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stats, setStats] = useState({ miners: null, avgRevenue: null, loading: true, error: null });
  const [walletAddress, setWalletAddress] = useState(() => localStorage.getItem('nm_wallet') || '');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://vawouugtzwmejxqkeqqj.supabase.co/functions/v1/cashdapp-health');
        if (res.ok) {
          const data = await res.json();
          setStats({ miners: data.miners ?? data.active_users ?? 0, avgRevenue: data.avg_revenue ?? 0, loading: false, error: null });
        } else { throw new Error('Stats unavailable'); }
      } catch (err) { console.warn('Stats:', err); setStats({ miners: 0, avgRevenue: 0, loading: false, error: null }); }
    };
    fetchStats();
  }, []);

  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'ios';
    }
    return 'android';
  };

  const getAppStoreLink = () => {
    const device = detectDevice();
    if (device === 'ios') {
      return 'https://apps.apple.com/app/termux/id1549540382';
    }
    return 'https://play.google.com/store/apps/details?id=com.termux';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-night-purple/20 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${nightSkyHero})` }}
      />
      
      {/* Floating Stars Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-20 left-10 w-6 h-6 text-money-gold animate-float opacity-60" />
        <Sparkles className="absolute top-40 right-20 w-4 h-4 text-money-gold-glow animate-float opacity-40" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute bottom-40 left-1/4 w-5 h-5 text-night-blue animate-float opacity-50" style={{ animationDelay: '2s' }} />
        <Moon className="absolute top-16 right-16 w-8 h-8 text-money-gold-glow animate-float opacity-30" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={nightMovesLogo} alt="Night Moves" className="w-10 h-10" />
            <h1 className="text-3xl font-bold font-logo bg-gradient-to-r from-money-gold to-money-gold-glow bg-clip-text text-transparent">
              Night Moves
            </h1>
          </div>
          <p className="text-xl text-foreground font-semibold mb-2">
            Make Money While You Sleep
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Turn your charging phone into a money-making machine. 
            Three simple steps, then automatic income every night.
          </p>
          
          {/* Live Stats from XMRT Ecosystem */}
          {/* Live Stats from XMRT Ecosystem */}
          <Card className="p-6 mt-8 bg-gradient-to-r from-card/80 to-card/40 border border-money-gold/20">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-money-gold">
                  {stats.loading ? '...' : (stats.miners ?? '0')}
                </div>
                <div className="text-sm text-muted-foreground">Active Miners</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-money-gold">
                  {stats.loading ? '...' : (stats.avgRevenue ? `$${Number(stats.avgRevenue).toFixed(2)}` : '$0')}
                </div>
                <div className="text-sm text-muted-foreground">Avg/Night</div>
              </div>
            </div>
            {stats.error && (
              <p className="text-xs text-muted-foreground text-center mt-2">Stats temporarily unavailable</p>
            )}
          </Card>
        </div>

        {/* Step 1: Download App */}
        <StepCard
          stepNumber={1}
          title="Get Your Helper App"
          description="We need one simple app to make this work"
          completed={completedSteps.includes(1)}
        >
          <div className="space-y-4">
            <p className="text-foreground text-lg">
              Download Termux - it's free and takes 30 seconds
            </p>
            <Button
              onClick={() => {
                window.open(getAppStoreLink(), '_blank');
                setTimeout(() => completeStep(1), 1000);
              }}
              className="w-full h-16 text-lg font-bold bg-gradient-to-r from-night-blue to-night-purple text-white rounded-2xl hover:shadow-step hover:scale-105 transition-all duration-300"
            >
              <Download className="w-6 h-6 mr-3" />
              Get Termux {detectDevice() === 'ios' ? '(App Store)' : '(Play Store)'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ✓ Completely free ✓ Safe & secure ✓ One-time setup
            </p>
          </div>
        </StepCard>

        {/* Step 2: Install Python */}
        <StepCard
          stepNumber={2}
          title="Copy This, Paste It"
          description="Open Termux and paste this magic code"
          completed={completedSteps.includes(2)}
        >
          <div className="space-y-4">
            <CodeBlock code="pkg install python" />
            <CopyButton 
              text="pkg install python" 
              stepNumber={2}
              variant="secondary"
            />
            <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
              <p className="text-accent font-semibold mb-2">📝 Simple Instructions:</p>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Paste the code above</li>
                <li>2. Hit enter</li>
                <li>3. Say "Y" if it asks</li>
                <li>4. Wait 2 minutes for magic to happen</li>
              </ol>
            </div>
            <Button
              onClick={() => completeStep(2)}
              variant="outline"
              className="w-full"
            >
              ✓ I Did This Step
            </Button>
          </div>
        </StepCard>

        {/* Step 3: Start Earning */}
        <StepCard
          stepNumber={3}
          title="Start Making Money"
          description="Copy this final code and you're done!"
          completed={completedSteps.includes(3)}
        >
          <div className="space-y-4">
            <CodeBlock code="curl -o signup.py -L https://raw.githubusercontent.com/xmrtdao/mmlauncher/main/scripts/mobile-signup.py && sha256sum signup.py && python3 signup.py  # Verify checksum before running" />
            <CopyButton 
              text="curl -o signup.py -L https://raw.githubusercontent.com/xmrtdao/mmlauncher/main/scripts/mobile-signup.py && sha256sum signup.py && python3 signup.py  # Verify checksum before running" 
              stepNumber={3}
              variant="primary"
            />
            <div className="bg-success-green/10 rounded-xl p-4 border border-success-green/20">
              <p className="text-success-green font-semibold mb-2">🎉 Final Step:</p>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Paste this code</li>
                <li>2. Hit enter</li>
                <li>3. Follow any prompts</li>
                <li>4. Congratulations! You're now making Night Moves!</li>
              </ol>
            </div>
            <Button
              onClick={() => completeStep(3)}
              className="w-full h-16 text-lg font-bold bg-gradient-to-r from-success-green to-success-green/80 text-white rounded-2xl hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              <DollarSign className="w-6 h-6 mr-3" />
              🎉 I'm Now Making Money!
            </Button>
          </div>
        </StepCard>

        {/* Success Message */}
        {completedSteps.length === 3 && (
          <Card className="p-8 text-center bg-gradient-to-r from-success-green/20 to-money-gold/20 border border-success-green/30 animate-fade-in-up">
            <div className="text-6xl mb-4">🌙💰</div>
            <h3 className="text-2xl font-bold text-money-gold mb-4">
              You're All Set!
            </h3>
            <p className="text-lg text-foreground mb-6">
              Your phone is now your night job! Plug it in before bed and wake up richer every morning.
            </p>
            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-night-blue to-night-purple text-white">
                <Smartphone className="w-5 h-5 mr-2" />
                Check Earnings
              </Button>
              <Button variant="outline" className="flex-1">
                Share Success
              </Button>
            </div>
          </Card>
        )}

        {/* Referral Section */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-card/80 to-card/40 border border-money-gold/20">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-money-gold mb-2">📢 Refer & Earn</h3>
              <p className="text-sm text-muted-foreground">Share your referral link and earn 0.001 XMR per mined hour</p>
            </div>
            {!walletAddress ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your wallet address to start"
                  className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white text-sm"
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (walletAddress) {
                      localStorage.setItem('nm_wallet', walletAddress);
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500"
                  disabled={!walletAddress.trim()}
                >
                  Save Wallet & Generate Code
                </Button>
              </div>
            ) : (
              <ReferralDashboard walletAddress={walletAddress} />
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground space-y-4 pb-8">
          <p className="text-sm">
            💤 Sleep well, wake up richer! 💤
          </p>
          <div className="text-xs space-y-2">
            <p>Powered by mobile mining technology</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="https://xmrt.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-money-gold hover:text-money-gold-glow transition-colors"
              >
                XMRT.io
              </a>
              <span>•</span>
              <a 
                href="https://mobilemonero.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-money-gold hover:text-money-gold-glow transition-colors"
              >
                MobileMonero.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


