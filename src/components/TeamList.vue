  <template>
  <v-container grid-list-md text-xs-center>
    <v-flex xs12 sm6>
      <v-select
        v-model="tournamentId"
        :items="tournaments"
        item-text="name"
        item-value="tournamentId"
        attach
        chips
        label="Tournaments"
      ></v-select>
    </v-flex>

    <v-layout row>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="teams"
          :pagination.sync="pagination"
          item-key="name"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <tr v-on:click="viewTeam(props.item.teamId)">
              <td class="text-xs-left">{{ props.item.uefaId }}</td>
              <td class="text-xs-left">
                <a :href="props.item.teamDetailUrl" target="_blank">{{ props.item.name }}</a>
              </td>
              <td class="text-xs-left">{{ props.item.country }}</td>
              <td class="text-xs-left">{{ props.item.eliminated }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex xs6 v-show="selectedTeamName ? true : false">
        <v-card style="text-align:-webkit-center">
          <v-img :src="selectedTeamImageUrl" height="227px" width="230px" padding="10px"></v-img>
          <v-card-title primary-title>
            <v-layout row>
              <input type="text" :disabled="isEditing ? false : true" v-model="selectedTeamName" class="headline">
              <v-checkbox :disabled="isEditing ? false : true" v-model="selectedTeamEliminated" label="Eliminated"></v-checkbox>
            </v-layout>
            <div>
               <input type="text" :disabled="isEditing ? false : true" v-model="selectedTeamCountry" class="grey--text">              
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn outline v-on:click="switchEdit()" flat>{{isEditing ? 'Cancel' : 'Edit'}}
              <v-icon small dark style="padding-left:10px" >edit</v-icon>
            </v-btn>
            <v-btn outline v-if="isEditing" v-on:click="updateTeam()" flat color="success">Save</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-alert :value="alert.show" :color="alert.type">{{alert.message}}</v-alert>
      <v-snackbar
      v-model="snackBar.show"
      :color="snackBar.color"
      :multi-line="snackBarmode === 'multi-line'"
      :timeout="snackBar.timeout"
      :vertical="snackBar.mode === 'vertical'"
      top=true
    >
      {{ snackBar.text }}
      <v-btn
        color="green"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>
  
<script>
import tournamentApi from "../services/cs_uefa_tournament_service";
import { async } from "q";

export default {
  data: function() {
    return {
      tournaments: [],
      selectedTeamId: null,
      selectedTeamName: null,
      selectedTeamCountry: null,
      selectedTeamImageUrl: '',
      selectedTeamDetailUrl:'',
      selectedTeamEliminated: false,
      uefaId: null,
      isEditing: false,
      alert: { show: false, type: "warning", message: "warning", position: 'top' },
      snackBar: {show: false, color: '', mode: '', timeout: 3000, text:''},
      selectedItem: "Sample",
      pagination: {
        sortBy: "name"
      },
      headers: [
        { text: "UefaId", align: "left", value: "teamId", width: "10%" },
        { text: "Team", align: "left", value: "team", width: "16%" },
        { text: "Team Country", align: "left", value: "country", width: "16%" },
        { text: "Eliminated", value: "eliminated", align: "left", width: "16%" }
      ],
      teams: []
    };
  },
  methods: {
    viewTeam: async function(teamId) {
      let selectedTeam = await tournamentApi.getTeamsForTournament(
        this.tournamentId,
        teamId
      );
      this.selectedTeamId = selectedTeam.data.teams[0].teamId;
      this.selectedTeamName = selectedTeam.data.teams[0].name;
      this.selectedTeamCountry = selectedTeam.data.teams[0].country;
      this.selectedTeamImageUrl = selectedTeam.data.teams[0].imageUrl;
      this.selectedTeamDetailUrl = selectedTeam.data.teams[0].teamDetailUrl;
      this.selectedTeamEliminated = selectedTeam.data.teams[0].eliminated;
      this.uefaId = selectedTeam.data.teams[0].uefaId;
    },
    getTournaments: async function() {
      let tournaments = await tournamentApi.getTournaments();
      let defaultTournament = tournaments.data[0];

      this.tournaments = tournaments.data;
      this.tournamentId = defaultTournament.tournamentId;
      this.loadTournament(defaultTournament.tournamentId);
    },
    loadTournament: async function(tournamentId) {
      let tournamentTeams = await tournamentApi.getTeamsForTournament(
        tournamentId
      );
      this.teams = tournamentTeams.data.teams;
      this.tournamentId = tournamentTeams.data.tournament[0].tournamentId;
    },
    switchEdit: async function() {
      this.isEditing = this.isEditing ? false : true;
      this.alert.show = this.isEditing;
      this.alert.type = "warning";
      this.alert.message = "You are now editing this team.";
    },
    updateTeam: async function() {
      let team = {
        name: this.selectedTeamName,
        country: this.selectedTeamCountry,
        eliminated: this.selectedTeamEliminated,
        teamId: this.selectedTeamId
      }
      let result = await tournamentApi.updateTeam(team, this.tournamentId);
      if (result.data.success) {
        this.alert.show = false;
        this.isEditing = false;
        this.snackBar.text = 'Success, updated team!';
        this.snackBar.show = true;
        this.loadTournament(this.tournamentId);
      }
    }
  },
  created: function() {
    this.getTournaments();
  }
};
</script>
 