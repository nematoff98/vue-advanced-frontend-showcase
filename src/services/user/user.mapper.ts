import {
  CreateUserForm, CreateUserFormExternal, UserSalaryForm, UserSalaryFormExternal,
} from '@/services/user/user.interface';

export const userFormExternalMapper = (model: CreateUserForm): CreateUserFormExternal => ({
  email: model.email,
  name: model.name,
  profile_name: model.profileName,
  password: model.password,
  is_2fa_required: model.is2faRequired,
  team_id: model.teamId,
  role_id: model.roleId,
});

export const userSalaryFormExternalMapper = (model: UserSalaryForm): UserSalaryFormExternal => ({
  user_id: model.userId,
  fixed_salary: model.fixedSalary,
  shareholding_fee: model.shareholdingFee,
  salary_configs: model.salaryConfigs?.map((p) => ({
    range_amount_from: p.rangeAmountFrom,
    range_amount_to: p.rangeAmountTo,
    percentage_amount: p.percentageAmount,
  })),
});
