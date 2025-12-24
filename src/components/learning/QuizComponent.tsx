import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw, Lightbulb } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz } from '@/data/courseData';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, proceed?: boolean) => void;
}

export default function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Array<{ questionId: string; isCorrect: boolean }>>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    setAnswers([...answers, {
      questionId: question.id,
      isCorrect: selectedAnswer === question.correct
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const correctCount = answers.filter(a => a.isCorrect).length + (selectedAnswer === question.correct ? 1 : 0);
      const score = Math.round((correctCount / quiz.questions.length) * 100);
      setQuizCompleted(true);
      onComplete(score);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className={cn(
          "text-center border-2",
          passed 
            ? "border-success/30 bg-gradient-to-br from-success/5 to-accent/5" 
            : "border-warning/30 bg-gradient-to-br from-warning/5 to-orange-500/5"
        )}>
          <CardHeader className="pb-2">
            <div className={cn(
              "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
              passed ? "bg-success/10" : "bg-warning/10"
            )}>
              <Trophy className={cn(
                "w-10 h-10",
                passed ? "text-success" : "text-warning"
              )} />
            </div>
            <CardTitle className="text-2xl font-heading">
              {passed ? '🎉 Félicitations !' : '💪 Continuez vos efforts !'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className={cn(
                "text-5xl font-bold mb-2",
                passed ? "text-success" : "text-warning"
              )}>
                {score}%
              </div>
              <p className="text-muted-foreground">
                {correctCount} / {quiz.questions.length} réponses correctes
              </p>
            </div>

            <div className="bg-card/50 rounded-lg p-4 border border-border">
              <p className="text-foreground">
                {passed 
                  ? `Vous avez réussi le quiz ! Score minimum requis : ${quiz.passingScore}%`
                  : `Score minimum requis : ${quiz.passingScore}%. Réessayez pour améliorer votre score.`
                }
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleRestartQuiz}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Recommencer
              </Button>
              {passed && (
                <Button
                  onClick={() => onComplete(score, true)}
                  className="gap-2 bg-success hover:bg-success/90"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion + 1} sur {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed font-heading">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correct;
                const showCorrect = showResult && isCorrect;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-200 border-2",
                      "flex items-center gap-3",
                      !showResult && !isSelected && "border-border hover:border-primary/50 hover:bg-primary/5",
                      !showResult && isSelected && "border-primary bg-primary/10",
                      showCorrect && "border-success bg-success/10",
                      showIncorrect && "border-destructive bg-destructive/10"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                      !showResult && !isSelected && "bg-muted text-muted-foreground",
                      !showResult && isSelected && "bg-primary text-primary-foreground",
                      showCorrect && "bg-success text-success-foreground",
                      showIncorrect && "bg-destructive text-destructive-foreground"
                    )}>
                      {showCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : showIncorrect ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className={cn(
                      "font-medium",
                      showCorrect && "text-success",
                      showIncorrect && "text-destructive"
                    )}>
                      {option}
                    </span>
                  </button>
                );
              })}

              {/* Explanation */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Explication</p>
                      <p className="text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                {!showResult ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Valider
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    {currentQuestion < quiz.questions.length - 1 ? (
                      <>
                        Question suivante
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Voir les résultats
                        <Trophy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
