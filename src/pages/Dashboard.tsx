import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Trophy, Star, Clock, ArrowRight, 
  Zap, Target, Award, Code, Users, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProgressProvider, useProgress } from '@/contexts/ProgressContext';
import LevelCard from '@/components/dashboard/LevelCard';

function DashboardContent() {
  const { progress, courseData, getOverallProgress, getLevelProgress } = useProgress();
  const overallProgress = getOverallProgress();

  // Calculate stats
  let totalLessons = 0;
  let totalModules = 0;
  let totalDuration = 0;
  courseData.levels.forEach(level => {
    totalModules += level.modules.length;
    level.modules.forEach(module => {
      totalLessons += module.lessons.length;
      const hours = parseFloat(module.duration);
      totalDuration += hours;
    });
  });

  const earnedBadges = courseData.badges.filter(b => progress.badges.includes(b.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bS0yIDBjMCAxLjEwNS0uODk1IDItMiAycy0yLS44OTUtMi0yIC44OTUtMiAyLTIgMiAuODk1IDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm px-4 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Plateforme d'apprentissage React
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-4">
              Apprenez React de <span className="text-gradient-hero bg-white bg-clip-text">A à Z</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Un parcours structuré pour maîtriser React, des fondamentaux aux concepts avancés
            </p>

            {/* Progress Overview */}
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Votre progression globale</span>
                <span className="text-2xl font-bold text-white">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 bg-white/20" />
              <div className="flex justify-between mt-4 text-sm text-white/70">
                <span>{progress.completed_lessons.length} leçons complétées</span>
                <span>{progress.total_points} points</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalModules}</p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Leçons</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalDuration}h</p>
                <p className="text-sm text-muted-foreground">De contenu</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-advanced/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-advanced" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges gagnés</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold font-heading text-foreground mb-4">Vos badges</h2>
            <div className="flex flex-wrap gap-3">
              {earnedBadges.map(badge => (
                <Badge 
                  key={badge.id} 
                  className="px-4 py-2 bg-card border-border text-foreground"
                  variant="outline"
                >
                  <span className="text-xl mr-2">{badge.icon}</span>
                  {badge.name}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Levels Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
            Parcours d'apprentissage
          </h2>
          <p className="text-muted-foreground">
            Progressez à travers les niveaux pour maîtriser React
          </p>
        </motion.div>

        <div className="space-y-8">
          {courseData.levels.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-foreground">React Master</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Apprenez React de A à Z avec des exercices pratiques
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProgressProvider>
      <DashboardContent />
    </ProgressProvider>
  );
}
