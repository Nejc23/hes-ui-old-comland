import { Injectable } from '@angular/core';
import { Role } from '../interfaces/role.interface';
import { RoleEnumerator } from '../enumerators/role-enumerator.model';
import { FunctionalityEnumerator } from '../enumerators/functionality-enumerator.model';
import { ActionEnumerator } from '../enumerators/action-enumerator.model';
import { UserRight } from '../interfaces/user-rights.interface';
import { User } from 'oidc-client';

@Injectable()
export class RoleService {
  constructor() {}

  private getUserRoles(user: User) {
    const jsonData = JSON.parse(JSON.stringify(user.profile));
    return jsonData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  // get unon rights from user roles
  setUSerRightsFromRoles(user: User) {
    const roles = this.getUserRoles(user);
    const rolesArray: string[] = [];
    if (!Array.isArray(roles)) {
      rolesArray.push(roles);
    } else {
      roles.forEach((element) => {
        rolesArray.push(element);
      });
    }

    let resultUserRight: UserRight[] = [];

    for (const role of rolesArray) {
      if (role.toLowerCase() === RoleEnumerator.user.toString().toLowerCase()) {
        resultUserRight = this.unionOfRights(resultUserRight, this.user);
      } else if (role.toLowerCase() === RoleEnumerator.partner.toString().toLowerCase()) {
        resultUserRight = this.unionOfRights(resultUserRight, this.partner);
      } else if (role.toLowerCase() === RoleEnumerator.registeredUser.toString().toLowerCase()) {
        resultUserRight = this.unionOfRights(resultUserRight, this.registeredUser);
      } else if (role.toLowerCase() === RoleEnumerator.companyAdmin.toString().toLowerCase()) {
        resultUserRight = this.unionOfRights(resultUserRight, this.companyAdmin);
      } else if (role.toLowerCase() === RoleEnumerator.superAdmin.toString().toLowerCase()) {
        resultUserRight = this.unionOfRights(resultUserRight, this.superAdmin);
      }
    }

    return resultUserRight;
  }

  private unionOfRights(resultUserRight: UserRight[], role: Role): UserRight[] {
    if (resultUserRight.length === 0) {
      this.pushNewUserRight(resultUserRight, role);
    } else {
      role.userRights.forEach((elmnCurrentRole) => {
        const exs = resultUserRight.find((x) => x.functionality.toLowerCase() === elmnCurrentRole.functionality.toLowerCase());

        if (typeof exs !== 'undefined' && exs != null) {
          if (!exs.writeRights) {
            exs.writeRights = elmnCurrentRole.writeRights;
          }
          elmnCurrentRole.action.forEach((actT) => {
            const actExists = exs.action.find((x) => x === actT);
            if (typeof actExists === 'undefined' || actExists == null) {
              exs.action.push(actT);
            }
          });
        } else {
          this.pushNewUserRight(resultUserRight, role);
        }
      });
    }
    return resultUserRight;
  }

  private pushNewUserRight(resultUserRight: UserRight[], role: Role) {
    let write = false;
    let functionalityStr = '';
    let actTmp: ActionEnumerator[] = [];

    role.userRights.forEach((elmnCurrentRole) => {
      functionalityStr = elmnCurrentRole.functionality;
      write = elmnCurrentRole.writeRights;

      actTmp = [];
      elmnCurrentRole.action.forEach((actT) => {
        actTmp.push(actT);
      });

      resultUserRight.push({
        functionality: functionalityStr,
        writeRights: write,

        action: actTmp
      });
    });

    return resultUserRight;
  }

  // fixed rights for roles
  // Super admin
  private get superAdmin() {
    const role: Role = {
      role: RoleEnumerator.superAdmin,
      userRights: [
        {
          functionality: FunctionalityEnumerator.dashboard.toString(),
          writeRights: true,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.DCU.toString(),
          writeRights: true,
          action: [ActionEnumerator.DCUConfiguration, ActionEnumerator.DCUUpgrade]
        },
        {
          functionality: FunctionalityEnumerator.MU.toString(),
          writeRights: true,
          action: [
            ActionEnumerator.MUBreakerStatus,
            ActionEnumerator.MUConnect,
            ActionEnumerator.MUDisconnect,
            ActionEnumerator.MUReadJobs,
            ActionEnumerator.MUJobsTemplates,
            ActionEnumerator.MUSetLimiter,
            ActionEnumerator.MUTOU,
            ActionEnumerator.MUUpgrade,
            ActionEnumerator.MUCiiState,
            ActionEnumerator.MUCiiActivate,
            ActionEnumerator.MUCiiDeactivate,
            ActionEnumerator.MUSetDisplaySettings,
            ActionEnumerator.MUClearAlarms,
            ActionEnumerator.MUDelete,
            ActionEnumerator.MUAdd,
            ActionEnumerator.MUJobsAssignExisting
          ]
        },
        {
          functionality: FunctionalityEnumerator.jobs.toString(),
          writeRights: true,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.alarmsEvents.toString(),
          writeRights: true,
          action: []
        }
      ]
    };

    return role;
  }

  // user
  private get user() {
    const role: Role = {
      role: RoleEnumerator.user,
      userRights: [
        {
          functionality: FunctionalityEnumerator.dashboard.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.DCU.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.MU.toString(),
          writeRights: false,
          action: [ActionEnumerator.MUUpgrade]
        },
        {
          functionality: FunctionalityEnumerator.jobs.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.alarmsEvents.toString(),
          writeRights: true,
          action: []
        }
      ]
    };

    return role;
  }

  // Partner
  private get partner() {
    const role: Role = {
      role: RoleEnumerator.partner,
      userRights: [
        {
          functionality: FunctionalityEnumerator.dashboard.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.DCU.toString(),
          writeRights: true,
          action: [ActionEnumerator.DCUUpgrade]
        },
        {
          functionality: FunctionalityEnumerator.MU.toString(),
          writeRights: false,
          action: [ActionEnumerator.MUBreakerStatus, ActionEnumerator.MUTOU]
        },
        {
          functionality: FunctionalityEnumerator.jobs.toString(),
          writeRights: true,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.alarmsEvents.toString(),
          writeRights: true,
          action: []
        }
      ]
    };

    return role;
  }

  // Company admin
  private get companyAdmin() {
    const role: Role = {
      role: RoleEnumerator.companyAdmin,
      userRights: [
        {
          functionality: FunctionalityEnumerator.dashboard.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.DCU.toString(),
          writeRights: true,
          action: [ActionEnumerator.DCUUpgrade]
        },
        {
          functionality: FunctionalityEnumerator.MU.toString(),
          writeRights: false,
          action: [ActionEnumerator.MUBreakerStatus, ActionEnumerator.MUTOU]
        },
        {
          functionality: FunctionalityEnumerator.jobs.toString(),
          writeRights: true,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.alarmsEvents.toString(),
          writeRights: true,
          action: []
        }
      ]
    };

    return role;
  }

  // Registered User
  private get registeredUser() {
    const role: Role = {
      role: RoleEnumerator.registeredUser,
      userRights: [
        {
          functionality: FunctionalityEnumerator.dashboard.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.DCU.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.MU.toString(),
          writeRights: false,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.jobs.toString(),
          writeRights: true,
          action: []
        },
        {
          functionality: FunctionalityEnumerator.alarmsEvents.toString(),
          writeRights: true,
          action: []
        }
      ]
    };

    return role;
  }
}
