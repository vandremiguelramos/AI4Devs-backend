import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { PrismaClient } from '@prisma/client';
import { CandidateRepository, ICandidateRepository } from '../../domain/repositories/candidateRepository';

const prisma = new PrismaClient();
const candidateRepository = new CandidateRepository(prisma);

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

export interface UpdateStageDTO {
    applicationId: number;
    interviewStepId: number;
}

export const updateCandidateStage = async (data: UpdateStageDTO): Promise<any> => {
    try {
        // Validar que os IDs existam
        if (!data.applicationId || !data.interviewStepId) {
            throw new Error('IDs de aplicação e etapa são obrigatórios');
        }

        // Atualizar a etapa do candidato
        const updatedApplication = await candidateRepository.updateCandidateStage(
            data.applicationId, 
            data.interviewStepId
        );

        if (!updatedApplication) {
            throw new Error('Aplicação não encontrada');
        }

        return {
            candidateId: updatedApplication.candidate.id,
            fullName: `${updatedApplication.candidate.firstName} ${updatedApplication.candidate.lastName}`,
            currentStep: updatedApplication.interviewStep.name,
            applicationId: updatedApplication.id
        };
    } catch (error) {
        console.error('Erro ao atualizar etapa do candidato:', error);
        throw error;
    }
};
