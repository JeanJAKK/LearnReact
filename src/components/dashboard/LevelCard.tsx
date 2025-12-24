import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Lock, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Level, Module } from '@/data/courseData';
import { useProgress } from '@/contexts/ProgressContext';

interface LevelCardProps {
  level: Level;
  index: number;
}

export default function LevelCard({ level, index }: LevelCardProps) {
  const { getLevelProgress, getModuleProgress, isLevelUnlocked, progress } = useProgress();
  const levelProgress = getLevelProgress(level.id);
  const isUnlocked = isLevelUnlocked(level.id);

  const levelColors = {
    beginner: {
      gradient: 'bg-gradient-beginner',
      light: 'bg-beginner-light',
      text: 'text-beginner',
      border: 'border-beginner/20',
    },
    intermediate: {
      gradient: 'bg-gradient-intermediate',
      light: 'bg-intermediate-light',
      text: 'text-intermediate',
      border: 'border-intermediate/20',
    },
    advanced: {
      gradient: 'bg-gradient-advanced',
      light: 'bg-advanced-light',
      text: 'text-advanced',
      border: 'border-advanced/20',
    },
  };

  const colors = levelColors[level.id as keyof typeof levelColors] || levelColors.beginner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        "overflow-hidden border-2 transition-all duration-300",
        isUnlocked ? "hover:shadow-xl" : "opacity-60",
        colors.border
      )}>
        {/* Level Header */}
        <div className={cn("p-6", colors.gradient)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{level.icon}</span>
              <div>
                <h2 className="text-2xl font-bold font-heading text-white">{level.title}</h2>
                <p className="text-white/80">{level.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{levelProgress}%</div>
              <p className="text-white/80 text-sm">Progression</p>
            </div>
          </div>
          {!isUnlocked && (
            <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 w-fit">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-white text-sm">
                Débloquez avec {level.requiredPoints} points
              </span>
            </div>
          )}
        </div>

        {/* Modules Grid */}
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {level.modules.map((module, moduleIndex) => {
              const moduleProgress = getModuleProgress(module.id);
              const isModuleCompleted = progress.completed_modules.includes(module.id);

              return (
                <Link
                  key={module.id}
                  to={isUnlocked ? `/module?levelId=${level.id}&moduleId=${module.id}` : '#'}
                  className={cn(
                    "block",
                    !isUnlocked && "pointer-events-none"
                  )}
                >
                  <motion.div
                    whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
                    className={cn(
                      "p-5 rounded-2xl border-2 transition-all duration-200",
                      isUnlocked 
                        ? "bg-card hover:shadow-lg border-border hover:border-primary/30 cursor-pointer"
                        : "bg-muted/30 border-border/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          isModuleCompleted 
                            ? "bg-success/10 text-success"
                            : colors.light + " " + colors.text
                        )}>
                          {isModuleCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <BookOpen className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      {isUnlocked && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {module.lessons.length} leçons
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progression</span>
                        <span className={cn("font-medium", isModuleCompleted ? "text-success" : colors.text)}>
                          {moduleProgress}%
                        </span>
                      </div>
                      <Progress 
                        value={moduleProgress} 
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
