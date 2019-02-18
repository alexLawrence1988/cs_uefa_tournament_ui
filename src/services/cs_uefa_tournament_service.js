import api from './api';
import { async } from 'q';

export default {
    getTournaments: async() => {
        
        let tournaments = await api.get('/');

        if (tournaments){
            return {
                success: true,
                data: tournaments.data
            }
        } else {
            return {
                success: false,
                message: 'An error occured reteiving a list of tournaments, please try again.'
            }
        }
    },
    getTeamsForTournament: async(tournamentId, teamId) => {
        let query = `/teams?tournamentId=${tournamentId}`;
        if (teamId){
            query += `&teamId=${teamId}`;
        }
        let teams = await api.get(query);
        if (teams){
            return {
                success: true,
                data: teams.data
            }
        } else {
            return {
                success: false,
                message: 'An error occured reteiving a list of teams, please try again.'
            }
        }
    },
    updateTeam: async function(team, tournamentId){
        let data = {
            tournamentId: tournamentId,
            team: team
        }
        return await api.post('/teams', data);
    }

}