from django.urls import path
from . import views

urlpatterns = [
    # Subject
    path('add-subject/', views.add_subject),
    path('single-subjects/<int:id>/', views.list_subjects),
    # path('get-subject/<int:id>/', views.get_subject),
    # path('delete-subject/<int:id>/', views.delete_subject),
    # path('update-subject/', views.update_subject),

    # Student
    path('add-student/', views.add_students),
    path('detail-student/<int:id>/', views.detail_student),
    # path('all-students/', views.list_students),
    # path('get-student/<str:username>/', views.get_student),
    # path('delete-student/<int:id>/', views.delete_student),
    # path('update-student/<str:username>/', views.update_student),
    
    # User
    # user/register-user
    path('register/', views.register),
    path('login/', views.login),
    path('all-user/', views.all_user),
    path('single-user/<str:username>/', views.single_user),
    path('profiles/<str:username>/', views.profiles),
    path('updata-profile/<str:username>/', views.updata_profile),
    # path('update-user/<str:username>/', views.update_user),
    path('admin_all/', views.list_admins),
    path('faculty-all/', views.list_faculty),

    # Attendance
    path('add-attendance/', views.add_attendance),
    path('date-subject/', views.date_subject),
    path('faculty/', views.faculty),
    path('faculty-subject-date/<int:id>/<int:subject_id>/<str:date>', views.faculty_subject_date),
    # path('get-attendance-by-faculty/<int:id>/', views.get_attendance_by_faculty),

    path("faculty_all/", views.faculty_all),
    path("add-subject/", views.subjects_all),
    path("students_all/", views.students_all),
    path("add-attendance/", views.add_attendance),
]
