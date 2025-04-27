export interface Interview {
  score: number | null;
}

export class CandidateScoreService {
  /**
   * Calcula a pontuação média com base nas entrevistas realizadas
   * @param interviews Lista de entrevistas
   * @returns Pontuação média ou null se não houver entrevistas com pontuação
   */
  static calculateAverageScore(interviews: Interview[]): number | null {
    const scores = interviews
      .map(interview => interview.score)
      .filter(score => score !== null) as number[];
    
    if (scores.length === 0) {
      return null;
    }
    
    const sum = scores.reduce((total, score) => total + score, 0);
    return sum / scores.length;
  }
} 