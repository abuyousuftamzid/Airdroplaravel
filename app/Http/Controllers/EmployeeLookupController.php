<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Packages;
use App\Models\DeliveryLocations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeLookupController extends Controller
{
    /**
     * Show the employee lookup form
     */
    public function index()
    {
        return Inertia::render('Employee/EmployeeLookup', [
            'employee' => null,
            'packages' => null,
            'message' => session('message', ''),
            'deliveryLocations' => DeliveryLocations::orderBy('location_name')->get()
        ]);
    }

    /**
     * Search for an employee by account number
     */
    public function search(Request $request)
    {
        $request->validate([
            'user_account_number' => 'required|string',
        ]);

        $userAccountNumber = $request->user_account_number;

        // Find employee by account number (non-customer)
        $employee = User::where('user_account_number', $userAccountNumber)
            ->where('user_type', '!=', 'customer')
            ->first();

        if (!$employee) {
            return Inertia::render('Employee/EmployeeLookup', [
                'employee' => null,
                'packages' => null,
                'message' => 'No employee found with this account number.',
                'deliveryLocations' => DeliveryLocations::orderBy('location_name')->get()
            ]);
        }

        // Get packages for this employee (using account number)
        $packages = Packages::where('package_user_account_number', $userAccountNumber)
            ->orderBy('package_creation_date_time', 'desc')
            ->get();

        $deliveryLocations = DeliveryLocations::orderBy('location_name')->get();

        return Inertia::render('Employee/EmployeeLookup', [
            'employee' => $employee,
            'packages' => $packages,
            'message' => '',
            'deliveryLocations' => $deliveryLocations
        ]);
    }

    /**
     * Update employee main information (step 1)
     */
    public function updateStep1(Request $request)
    {
        $request->validate([
            'user_account_number' => 'required|string',
            'user_email' => 'required|email',
            'user_first_last_name' => 'required|string',
            'user_second_last_name' => 'nullable|string',
            'user_identity_number' => 'required|string',
            'user_phone' => 'nullable|string',
            'user_mobile' => 'nullable|string',
            'user_phone_office' => 'nullable|string',
            'user_identity_type' => 'required|string',
            'user_address_line_1' => 'nullable|string',
            'user_address_line_2' => 'nullable|string',
            'user_address_city' => 'nullable|string',
            'user_address_state' => 'nullable|string',
            'user_delivery_instructions' => 'nullable|string',
            'user_package_delivery_location' => 'nullable|integer',
            'user_fax' => 'nullable|string',
            'user_trn_number' => 'nullable|string',
        ]);

        $employee = User::where('user_account_number', $request->user_account_number)
            ->where('user_type', '!=', 'customer')
            ->first();

        if (!$employee) {
            return redirect()->route('admin.employees.lookup.index')
                ->with('message', 'Employee not found.');
        }

        $employee->update([
            'user_email' => $request->user_email,
            'user_first_last_name' => $request->user_first_last_name,
            'user_second_last_name' => $request->user_second_last_name,
            'user_identity_number' => $request->user_identity_number,
            'user_phone' => $request->user_phone,
            'user_mobile' => $request->user_mobile,
            'user_phone_office' => $request->user_phone_office,
            'user_identity_type' => $request->user_identity_type,
            'user_address_line_1' => $request->user_address_line_1,
            'user_address_line_2' => $request->user_address_line_2,
            'user_address_city' => $request->user_address_city,
            'user_address_state' => $request->user_address_state,
            'user_delivery_instructions' => $request->user_delivery_instructions,
            'user_package_delivery_location' => $request->user_package_delivery_location,
            'user_fax' => $request->user_fax,
            'user_trn_number' => $request->user_trn_number,
        ]);

        // Return updated employee data
        $employee = User::where('user_account_number', $request->user_account_number)
            ->where('user_type', '!=', 'customer')
            ->first();

        $packages = Packages::where('package_user_account_number', $request->user_account_number)
            ->orderBy('package_creation_date_time', 'desc')
            ->get();

        $deliveryLocations = DeliveryLocations::orderBy('location_name')->get();

        return Inertia::render('Employee/EmployeeLookup', [
            'employee' => $employee,
            'packages' => $packages,
            'message' => 'Employee information updated successfully.',
            'deliveryLocations' => $deliveryLocations
        ]);
    }

    /**
     * Update employee account details (step 2)
     */
    public function updateStep2(Request $request)
    {
        $request->validate([
            'user_account_number' => 'required|string',
            'user_account_type' => 'required|string',
            'user_account_status' => 'required|string',
            'status_change_comment' => 'nullable|string',
        ]);

        $employee = User::where('user_account_number', $request->user_account_number)
            ->where('user_type', '!=', 'customer')
            ->first();

        if (!$employee) {
            return redirect()->route('admin.employees.lookup.index')
                ->with('message', 'Employee not found.');
        }

        $employee->update([
            'user_account_type' => $request->user_account_type,
            'user_account_status' => $request->user_account_status,
            'status_change_comment' => $request->status_change_comment,
        ]);

        // Return updated employee data
        $employee = User::where('user_account_number', $request->user_account_number)
            ->where('user_type', '!=', 'customer')
            ->first();

        $packages = Packages::where('package_user_account_number', $request->user_account_number)
            ->orderBy('package_creation_date_time', 'desc')
            ->get();

        $deliveryLocations = DeliveryLocations::orderBy('location_name')->get();

        return Inertia::render('Employee/EmployeeLookup', [
            'employee' => $employee,
            'packages' => $packages,
            'message' => 'Employee information updated successfully.',
            'deliveryLocations' => $deliveryLocations
        ]);
    }

    /**
     * Toggle employee account status (activate/deactivate)
     */
    public function toggleStatus(Request $request)
    {
        $request->validate([
            'user_account_number' => 'required|string',
            'action' => 'required|in:activate,deactivate',
        ]);

        $employee = User::where('user_account_number', $request->user_account_number)
            ->where('user_type', '!=', 'customer')
            ->first();

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        $newStatus = $request->action === 'activate' ? 'activate' : 'deactivate';
        $employee->update(['account_status' => $newStatus]);

        return response()->json(['success' => true, 'status' => $newStatus]);
    }
}
