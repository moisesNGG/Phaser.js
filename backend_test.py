#!/usr/bin/env python3
"""
Backend API Testing for Phaser.js Demo Application
Tests all endpoints with realistic data and validates responses
"""

import requests
import json
import sys
from datetime import datetime
import time

# Get the backend URL from frontend environment
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_URL}")

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def log_test(test_name, success, message="", response=None):
    """Log test results"""
    if success:
        print(f"✅ {test_name}: {message}")
        test_results["passed"] += 1
    else:
        print(f"❌ {test_name}: {message}")
        if response:
            print(f"   Response: {response.status_code} - {response.text[:200]}")
        test_results["failed"] += 1
        test_results["errors"].append(f"{test_name}: {message}")

def test_health_check():
    """Test GET /api/ - Health check"""
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "version" in data:
                log_test("Health Check", True, f"API is running - {data['message']}")
                return True
            else:
                log_test("Health Check", False, "Missing required fields in response", response)
        else:
            log_test("Health Check", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Health Check", False, f"Request failed: {str(e)}")
    return False

def test_get_all_demos():
    """Test GET /api/demos - Get all demos"""
    try:
        response = requests.get(f"{API_URL}/demos", timeout=10)
        if response.status_code == 200:
            demos = response.json()
            if isinstance(demos, list) and len(demos) > 0:
                # Validate demo structure
                demo = demos[0]
                required_fields = ["id", "title", "description", "level", "code_example", "technologies", "difficulty", "preview", "scene_name"]
                if all(field in demo for field in required_fields):
                    log_test("Get All Demos", True, f"Retrieved {len(demos)} demos successfully")
                    return demos
                else:
                    missing = [f for f in required_fields if f not in demo]
                    log_test("Get All Demos", False, f"Missing fields in demo: {missing}", response)
            else:
                log_test("Get All Demos", False, "No demos returned or invalid format", response)
        else:
            log_test("Get All Demos", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Get All Demos", False, f"Request failed: {str(e)}")
    return []

def test_filter_demos_by_level():
    """Test GET /api/demos?level=basic/intermediate/advanced - Filter demos by level"""
    levels = ["basic", "intermediate", "advanced"]
    all_passed = True
    
    for level in levels:
        try:
            response = requests.get(f"{API_URL}/demos?level={level}", timeout=10)
            if response.status_code == 200:
                demos = response.json()
                if isinstance(demos, list):
                    # Verify all demos have the correct level
                    if all(demo.get("level") == level for demo in demos):
                        log_test(f"Filter Demos ({level})", True, f"Retrieved {len(demos)} {level} demos")
                    else:
                        log_test(f"Filter Demos ({level})", False, "Some demos have incorrect level", response)
                        all_passed = False
                else:
                    log_test(f"Filter Demos ({level})", False, "Invalid response format", response)
                    all_passed = False
            else:
                log_test(f"Filter Demos ({level})", False, f"Unexpected status code: {response.status_code}", response)
                all_passed = False
        except Exception as e:
            log_test(f"Filter Demos ({level})", False, f"Request failed: {str(e)}")
            all_passed = False
    
    return all_passed

def test_get_specific_demo(demos):
    """Test GET /api/demos/{demo_id} - Get specific demo"""
    if not demos:
        log_test("Get Specific Demo", False, "No demos available for testing")
        return False
    
    demo_id = demos[0]["id"]
    try:
        response = requests.get(f"{API_URL}/demos/{demo_id}", timeout=10)
        if response.status_code == 200:
            demo = response.json()
            if demo.get("id") == demo_id:
                log_test("Get Specific Demo", True, f"Retrieved demo: {demo['title']}")
                return True
            else:
                log_test("Get Specific Demo", False, "Demo ID mismatch", response)
        else:
            log_test("Get Specific Demo", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Get Specific Demo", False, f"Request failed: {str(e)}")
    return False

def test_get_nonexistent_demo():
    """Test GET /api/demos/{demo_id} with non-existent ID"""
    fake_id = "non-existent-demo-id"
    try:
        response = requests.get(f"{API_URL}/demos/{fake_id}", timeout=10)
        if response.status_code == 404:
            log_test("Get Non-existent Demo", True, "Correctly returned 404 for non-existent demo")
            return True
        else:
            log_test("Get Non-existent Demo", False, f"Expected 404, got {response.status_code}", response)
    except Exception as e:
        log_test("Get Non-existent Demo", False, f"Request failed: {str(e)}")
    return False

def test_save_score():
    """Test POST /api/scores - Save game score"""
    score_data = {
        "player_name": "AcePlayer",
        "score": 2500,
        "level": 3,
        "lives_remaining": 2,
        "time_played": 180
    }
    
    try:
        response = requests.post(f"{API_URL}/scores", json=score_data, timeout=10)
        if response.status_code == 200:
            saved_score = response.json()
            # Validate response structure
            required_fields = ["id", "player_name", "score", "level", "lives_remaining", "time_played", "timestamp"]
            if all(field in saved_score for field in required_fields):
                if saved_score["player_name"] == score_data["player_name"] and saved_score["score"] == score_data["score"]:
                    log_test("Save Score", True, f"Score saved for {saved_score['player_name']}: {saved_score['score']} points")
                    return saved_score
                else:
                    log_test("Save Score", False, "Score data mismatch", response)
            else:
                missing = [f for f in required_fields if f not in saved_score]
                log_test("Save Score", False, f"Missing fields in response: {missing}", response)
        else:
            log_test("Save Score", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Save Score", False, f"Request failed: {str(e)}")
    return None

def test_save_multiple_scores():
    """Test saving multiple scores for leaderboard testing"""
    test_scores = [
        {"player_name": "SpaceAce", "score": 3200, "level": 4, "lives_remaining": 1, "time_played": 240},
        {"player_name": "StarFighter", "score": 2800, "level": 3, "lives_remaining": 0, "time_played": 200},
        {"player_name": "GalaxyHero", "score": 1900, "level": 2, "lives_remaining": 3, "time_played": 150},
        {"player_name": "CosmicWarrior", "score": 4100, "level": 5, "lives_remaining": 2, "time_played": 300}
    ]
    
    saved_count = 0
    for score_data in test_scores:
        try:
            response = requests.post(f"{API_URL}/scores", json=score_data, timeout=10)
            if response.status_code == 200:
                saved_count += 1
            time.sleep(0.1)  # Small delay between requests
        except Exception as e:
            print(f"   Warning: Failed to save score for {score_data['player_name']}: {e}")
    
    log_test("Save Multiple Scores", saved_count > 0, f"Saved {saved_count}/{len(test_scores)} additional scores")
    return saved_count > 0

def test_get_leaderboard():
    """Test GET /api/scores/leaderboard - Get leaderboard"""
    try:
        response = requests.get(f"{API_URL}/scores/leaderboard", timeout=10)
        if response.status_code == 200:
            leaderboard = response.json()
            if isinstance(leaderboard, list):
                if len(leaderboard) > 0:
                    # Validate leaderboard structure
                    entry = leaderboard[0]
                    required_fields = ["rank", "player_name", "score", "level", "timestamp"]
                    if all(field in entry for field in required_fields):
                        # Verify scores are in descending order
                        scores_ordered = all(leaderboard[i]["score"] >= leaderboard[i+1]["score"] 
                                           for i in range(len(leaderboard)-1))
                        if scores_ordered:
                            log_test("Get Leaderboard", True, f"Retrieved {len(leaderboard)} leaderboard entries, properly ordered")
                            return True
                        else:
                            log_test("Get Leaderboard", False, "Leaderboard not properly ordered by score", response)
                    else:
                        missing = [f for f in required_fields if f not in entry]
                        log_test("Get Leaderboard", False, f"Missing fields in leaderboard entry: {missing}", response)
                else:
                    log_test("Get Leaderboard", True, "Empty leaderboard (no scores yet)")
                    return True
            else:
                log_test("Get Leaderboard", False, "Invalid response format", response)
        else:
            log_test("Get Leaderboard", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Get Leaderboard", False, f"Request failed: {str(e)}")
    return False

def test_get_leaderboard_with_limit():
    """Test GET /api/scores/leaderboard?limit=5 - Get limited leaderboard"""
    try:
        response = requests.get(f"{API_URL}/scores/leaderboard?limit=3", timeout=10)
        if response.status_code == 200:
            leaderboard = response.json()
            if isinstance(leaderboard, list) and len(leaderboard) <= 3:
                log_test("Get Limited Leaderboard", True, f"Retrieved {len(leaderboard)} entries (limit=3)")
                return True
            else:
                log_test("Get Limited Leaderboard", False, f"Expected max 3 entries, got {len(leaderboard)}", response)
        else:
            log_test("Get Limited Leaderboard", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Get Limited Leaderboard", False, f"Request failed: {str(e)}")
    return False

def test_get_game_stats():
    """Test GET /api/stats - Get game statistics"""
    try:
        response = requests.get(f"{API_URL}/stats", timeout=10)
        if response.status_code == 200:
            stats = response.json()
            required_fields = ["total_games", "average_score", "highest_score", "most_played_level"]
            if all(field in stats for field in required_fields):
                # Validate data types
                if (isinstance(stats["total_games"], int) and 
                    isinstance(stats["average_score"], (int, float)) and
                    isinstance(stats["highest_score"], int) and
                    isinstance(stats["most_played_level"], int)):
                    log_test("Get Game Stats", True, 
                           f"Stats: {stats['total_games']} games, avg: {stats['average_score']}, high: {stats['highest_score']}")
                    return True
                else:
                    log_test("Get Game Stats", False, "Invalid data types in stats", response)
            else:
                missing = [f for f in required_fields if f not in stats]
                log_test("Get Game Stats", False, f"Missing fields in stats: {missing}", response)
        else:
            log_test("Get Game Stats", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Get Game Stats", False, f"Request failed: {str(e)}")
    return False

def test_create_demo():
    """Test POST /api/demos - Create new demo (admin)"""
    demo_data = {
        "title": "Test Demo",
        "description": "A test demo for API validation",
        "level": "basic",
        "code_example": "// Test code\nconsole.log('Hello Phaser!');",
        "technologies": ["Test", "API"],
        "difficulty": "Fácil",
        "preview": "Test preview",
        "scene_name": "TestScene"
    }
    
    try:
        response = requests.post(f"{API_URL}/demos", json=demo_data, timeout=10)
        if response.status_code == 200:
            created_demo = response.json()
            if created_demo.get("title") == demo_data["title"]:
                log_test("Create Demo", True, f"Created demo: {created_demo['title']}")
                return created_demo
            else:
                log_test("Create Demo", False, "Demo data mismatch", response)
        else:
            log_test("Create Demo", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Create Demo", False, f"Request failed: {str(e)}")
    return None

def test_delete_demo(demo_id):
    """Test DELETE /api/demos/{demo_id} - Delete demo (admin)"""
    try:
        response = requests.delete(f"{API_URL}/demos/{demo_id}", timeout=10)
        if response.status_code == 200:
            result = response.json()
            if "message" in result:
                log_test("Delete Demo", True, f"Demo deleted: {result['message']}")
                return True
            else:
                log_test("Delete Demo", False, "Missing message in response", response)
        else:
            log_test("Delete Demo", False, f"Unexpected status code: {response.status_code}", response)
    except Exception as e:
        log_test("Delete Demo", False, f"Request failed: {str(e)}")
    return False

def test_delete_nonexistent_demo():
    """Test DELETE /api/demos/{demo_id} with non-existent ID"""
    fake_id = "non-existent-demo-id"
    try:
        response = requests.delete(f"{API_URL}/demos/{fake_id}", timeout=10)
        if response.status_code == 404:
            log_test("Delete Non-existent Demo", True, "Correctly returned 404 for non-existent demo")
            return True
        else:
            log_test("Delete Non-existent Demo", False, f"Expected 404, got {response.status_code}", response)
    except Exception as e:
        log_test("Delete Non-existent Demo", False, f"Request failed: {str(e)}")
    return False

def run_all_tests():
    """Run all backend API tests"""
    print("🚀 Starting Phaser.js Demo Backend API Tests")
    print("=" * 60)
    
    # Test 1: Health check
    if not test_health_check():
        print("❌ Health check failed - API may not be running")
        return False
    
    # Test 2: Get all demos
    demos = test_get_all_demos()
    
    # Test 3: Filter demos by level
    test_filter_demos_by_level()
    
    # Test 4: Get specific demo
    test_get_specific_demo(demos)
    
    # Test 5: Get non-existent demo
    test_get_nonexistent_demo()
    
    # Test 6: Save score
    test_save_score()
    
    # Test 7: Save multiple scores for leaderboard testing
    test_save_multiple_scores()
    
    # Test 8: Get leaderboard
    test_get_leaderboard()
    
    # Test 9: Get limited leaderboard
    test_get_leaderboard_with_limit()
    
    # Test 10: Get game stats
    test_get_game_stats()
    
    # Test 11: Create demo (admin)
    created_demo = test_create_demo()
    
    # Test 12: Delete demo (admin)
    if created_demo:
        test_delete_demo(created_demo["id"])
    
    # Test 13: Delete non-existent demo
    test_delete_nonexistent_demo()
    
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"📈 Success Rate: {test_results['passed']/(test_results['passed']+test_results['failed'])*100:.1f}%")
    
    if test_results["errors"]:
        print("\n🔍 FAILED TESTS:")
        for error in test_results["errors"]:
            print(f"   • {error}")
    
    return test_results["failed"] == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)