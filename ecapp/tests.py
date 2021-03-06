####
#
# Copyright (c) 2013, Rearden Commerce Inc. All Rights Reserved.
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
####
"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User
import ecapp.models 
from datetime import date
from ecapp.forms import TestCaseForm, TestPlanForm
from django.test.client import RequestFactory

class TestCaseViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user('test', 'test@test.com', 'test')
        self.logged_in = self.client.login(username='test', password='test')
        root_folder = ecapp.models.Folder.objects.get(name='root')
        sample_folder = ecapp.models.Folder.objects.create(name='testfolder', parent=root_folder)
        sample_testcase = ecapp.models.TestCase.objects.create(name='testcase', author=self.user, folder=sample_folder)

    def test_test_case_summary_view(self):
        response = self.client.get('/test_case/')
        self.assertEqual(response.status_code, 200)

    def test_test_case_edit(self):
        self.assertEqual(self.logged_in, True)
        data = {'name':'test', 'description':'test'}
        # creare a new test case
        response = self.client.post('/create_test_case/', data, follow=True)
        self.assertEqual(response.status_code, 200)
        # editing an exsiting testcase
        test_case = ecapp.models.TestCase.objects.get(name='testcase')
        url = '/test_case/' + str(test_case.id) + '/edit/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        
    def test_test_case_clone(self):
        self.assertEqual(self.logged_in, True)
        test_case = ecapp.models.TestCase.objects.get(name='testcase')
        url = '/clone_test_case/' + str(test_case.id)
        response = self.client.post(url)
        self.assertEqual(response.status_code, 301)

    def test_test_case_plot(self):
        test_case = ecapp.models.TestCase.objects.get(name='testcase')
        url = '/test_case/' + str(test_case.id) + '/result/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_test_case_view(self):
        test_case = ecapp.models.TestCase.objects.get(name='testcase')
        url = '/test_case/' + str(test_case.id)
        response = self.client.get(url, follow=True)
        self.assertEqual(response.redirect_chain[0][1], 301)

    def test_test_case_modal(self):
        test_case = ecapp.models.TestCase.objects.get(name='testcase')
        url = '/test_case/' + str(test_case.id) + '/modal/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

class TestPlanViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user('test', 'test@test.com', 'test')
        self.logged_in = self.client.login(username='test', password='test')
        sample_testcase = ecapp.models.TestCase.objects.create(name='testcase', author=self.user)
        sample_testplan = ecapp.models.TestPlan.objects.create(name='testplan', creator=self.user, start_date=date.today(), enabled=True)
        testplan_testcase_link = ecapp.models.TestplanTestcaseLink.objects.create(testcase=sample_testcase, testplan=sample_testplan)

    def test_test_plan_summary_view(self):
        response = self.client.get('/test_plan/')
        self.assertEqual(response.status_code, 200)

    def test_test_plan_archive_view(self):
        response = self.client.get('/test_plan/archive/')
        self.assertEqual(response.status_code, 200)

    def test_test_plan_add_results(self):
        self.assertEqual(self.logged_in, True)
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/test_plan/' + str(test_plan.id) + '/result/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_edit_test_plan_view(self):
        self.assertEqual(self.logged_in, True)
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/test_plan/' + str(test_plan.id) + '/edit/'
        response = self.client.get(url, follow=True)
        self.assertEqual(response.status_code, 200)

    def test_create_test_plan_view(self):
        self.assertEqual(self.logged_in, True)
        data = {'name':'create_testplan' , 'creator':self.user, 'start_date':date.today(), 'enabled':True}
        response = self.client.post('/create_test_plan/', data, follow=True)
        self.assertEqual(response.status_code, 200)

    def test_clone_test_plan_view(self):
        self.assertEqual(self.logged_in, True)
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/clone_test_plan/' + str(test_plan.id)
        response = self.client.post(url, follow=True)
        self.assertEqual(response.status_code, 200)

    def test_add_testcase_view(self):
        self.assertEqual(self.logged_in, True)
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/test_plan/' + str(test_plan.id) + '/tests/add/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_review_testcases_view(self):
        self.assertEqual(self.logged_in, True)
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/test_plan/' + str(test_plan.id) + '/tests/review/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_test_plan_plot(self):
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/test_plan/' + str(test_plan.id) + '/plot'
        response = self.client.get(url, follow=True)
        self.assertEqual(response.redirect_chain[0][1], 301)

    def test_analyze(self):
        test_plan = ecapp.models.TestPlan.objects.get(name='testplan')
        url = '/test_plan/' + str(test_plan.id) + '/analyze/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

class RESTViewsTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_restAPI(self): 
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, 200)

class OtherViewsTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_help(self):
        response = self.client.get('/help/')
        self.assertEqual(response.status_code, 200)
